const WebSocket = require('ws');
const readlineSync = require('readline-sync');
const Decoder = require('./decoder');
const Encoder = require('./encoder');
const request = require('request-promise');
const sleep = require('./sleep');

const url = 'https://www.gimkit.com/play?a=5e25fd9fb3182f0022544161&class=5e25fd812cceb80022cc5b80' || readlineSync.question('Gimkit assignment URL: ');
const name = 'Lucas' || readlineSync.question('Your name: ');

/**
 * @typedef {import('./lib').GameData} GameData
 * @typedef {import('./lib').GameQuestion} GameQuestion
 * @typedef {import('./lib').GroupMember} GroupMember
 * @typedef {import('./lib').AssignmentData} AssignmentData
 * @typedef {import('./lib').Powerup} Powerup
 * @typedef {import('./lib').Upgrade} Upgrade
 */
(async () => {
	/**
	 * @type string
	 */
	const page = await request.get(url);
	/**
	 * @type GameData
	 */
	const gameData = JSON.parse(page.substring(page.indexOf('window.gameData = ') + 18, page.indexOf('\n', page.indexOf('window.gameData = '))));
	/**
	 * @type AssignmentData
	 */
	const assignmentData = JSON.parse(page.substring(page.indexOf('window.assignmentData = ') + 24, page.indexOf('\n', page.indexOf('window.assignmentData = '))));
	/**
	 * @type GroupMember[]
	 */
	const groupMembers = JSON.parse(page.substring(page.indexOf('window.groupMembers = ') + 21, page.indexOf('\n', page.indexOf('window.groupMembers = '))));

	const masterData = {
		packet0: {
			sid: null,
			pingInterval: null,
			pingTimeout: null,
			upgrades: null
		},
		packet4: {
			type: null,
			nsp: null
		},
		roomId: null,
		state: {
			/**
			 * @type GameQuestion[]
			 */
			GAME_QUESTIONS: null,
			BALANCE: null,
			BALANCE_CHANGE: {
				balanceChangeIfCorrect: null,
				balanceChangeIfIncorrect: null
			},
			NAME: null,
			GROUP: {
				groupId: null,
				groupMemberId: null
			},
			THEME: null,
			/**
			 * @type string[]
			 */
			PURCHASED_THEMES: null,
			UPGRADE_LEVELS: {
				moneyPerQuestion: null,
				streakBonus: null,
				multiplier: null,
				insurance: null
			}
		},
		staticState: {
			/**
			 * @type Powerup[]
			 */
			powerups: null,
			/**
			 * @type Upgrade[]
			 */
			upgrades: null
		}
	};
	let lastRid = Math.random();

	const server = JSON.parse(await request.get('https://www.gimkit.com/matchmaker/find-server')).url;
	console.log('Using WebSocket server: ' + server);

	const socket = new WebSocket(server + '/blueboat/?id=&EIO=3&transport=websocket');
	socket.on('open', () => {
		socket.on('message', data => {
			const buf = Buffer.from(data);
			const str = buf.toString();
			if (str[0] === '0' || str[0] === '4') {
				// json data packet
				const json = JSON.parse(str.substring(1));
				if (str[0] === '0') {
					masterData.packet0 = json;
				} else if (str[0] === '4') {
					masterData.packet4 = json;
				}
			} else if (buf[0] === 0x04) {
				// binary data packet
				const decoder = new Decoder(buf);
				const decoded = decoder.parse();

				if (decoded.type === 2) {
					if (decoded.data[0] === 'CLIENT_ID_SET') {
						// TODO: encode
						const encoder = new Encoder();
						socket.send(encoder.encodeMessageBuffer({
							type: 2,
							nsp: '/',
							data: [
								'blueboat_CREATE_NEW_ROOM',
								{
									type: 'HomeworkGame',
									options: {
										assignmentId: assignmentData._id,
										questions: gameData.questions,
										gameOptions: {
											type: {
												type: 'assignment',
												value: 1
											},
											goal: {
												type: 'race',
												value: assignmentData.gameOptions.gameGoalValue
											},
											handicap: assignmentData.gameOptions.handicap,
											answerCheck: true,
											startingCash: assignmentData.gameOptions.startingCash,
											groupMembers: groupMembers
										},
										create: true
									},
									uniqueRequestId: lastRid = Math.random().toString()
								}
							],
							options: {
								compress: true
							}
						}));
					} else if (decoded.data[0] === lastRid + '-create') {
						masterData.roomId = decoded.data[1];
						console.log('Got room ID: ' + masterData.roomId);
						const encoder = new Encoder();
						socket.send(encoder.encodeMessageBuffer({
							type: 2,
							nsp: '/',
							data: [
								'blueboat_JOIN_ROOM',
								{
									roomId: masterData.roomId,
									options: {
										assignmentId: assignmentData._id,
										questions: gameData.questions,
										gameOptions: {
											type: {
												type: 'assignment',
												value: 1
											},
											goal: {
												type: 'race',
												value: assignmentData.gameOptions.gameGoalValue
											},
											handicap: assignmentData.gameOptions.handicap,
											answerCheck: true,
											startingCash: assignmentData.gameOptions.startingCash,
											groupMembers: groupMembers
										},
										create: true
									},
									uniqueRequestId: lastRid = Math.random().toString()
								}
							],
							options: {
								compress: true
							}
						}));

						setInterval(() => {
							socket.send(Buffer.from([0x02]));
						}, masterData.packet0.pingInterval);

						setTimeout(async () => {
							console.log('Logging in...');
							const encoder = new Encoder();
							const groupMember = groupMembers.filter(member => member.name === name)[0];
							socket.send(encoder.encodeMessageBuffer({
								type: 2,
								data: [
									'blueboat_SEND_MESSAGE',
									{
										room: masterData.roomId,
										key: 'PLAYER_USER_DETAILS',
										data: {
											name: groupMember.name,
											groupId: groupMember.group,
											groupMemberId: groupMember._id
										}
									}
								],
								options: {
									compress: true
								},
								nsp: '/'
							}));

							let nextQuestion = 0;
							while (true) {
								const question = masterData.state.GAME_QUESTIONS[nextQuestion++];
								socket.send(encoder.encodeMessageBuffer({
									type: 2,
									data: [
										'blueboat_SEND_MESSAGE',
										{
											room: masterData.roomId,
											key: 'QUESTION_ANSWERED',
											data: {
												questionId: question._id,
												answer: question.answers.filter(answer => answer.correct)[0]._id
											}
										}
									],
									options: {
										compress: true
									},
									nsp: '/'
								}));
								await sleep(50);

								console.log(masterData.state.BALANCE);
								
								if (nextQuestion === masterData.state.GAME_QUESTIONS.length) {
									nextQuestion = 0;
								}
							}
						}, 2500);
					} else if (decoded.data[0].startsWith('message-')) {
						const { key, data } = decoded.data[1];
						if (key === 'STATE_UPDATE') {
							masterData.state[data.type] = data.value;
						} else if (key === 'PLAYER_JOINS_STATIC_STATE') {
							masterData.staticState = data;
						} else if (key === 'blueboat_JOINED_ROOM') {
							console.log('Successfully joined the room.');
						} else {
							console.log('Received unhandled packet...');
							console.log(key);
							console.log(data);
							console.log('\n\n\n');
						}
					} else {
						console.log('Received unhandled packet...');
						console.log(decoded);
						console.log('\n\n\n');
					}
				}
			} else {
				if (buf.length !== 1 || buf[0] !== 0x33) {
					console.log('Unknown buffer!');
					console.log(buf);
				}
			}
		});
	});
})();
