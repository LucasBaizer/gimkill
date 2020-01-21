declare interface GameData {
	_id: string;
	gif: string;
	isActive: boolean;
	source: string;
	originalSoruce: string;
	privacy: string;
	isArchived: boolean;
	editCount: number;
	title: string;
	creator: string;
	lang: string;
	subject: string;
	gradeLevel: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	questions: GameQuestion[];
}

export interface GameQuestion {
	type: 'mc' | 'other';
	position: number;
	isActive: boolean;
	_id: string;
	text: string;
	game: string;
	answers: {
		correct: boolean;
		_id: string;
		text: string;
	}[];
	image: string;
	audio: string;
	source: string;
	__v: number;
}

export interface AssignmentData {
	groups: string[];
	isActive: boolean;
	gameOptions: {
		showCorrectAnswer: boolean;
		gameGoalValue: number;
		startingCash: number;
		handicap: number;
	};
	_id: string;
	game: string;
	dueDate: string;
	customTag: string;
	creator: string;
	completed: {
		completedAt: string;
		startedAt: string;
		_id: string;
		playerName: string;
		groupId: string;
		groupMemberId: string;
		stats: {
			correct: number;
			wrong: number;
			correctQuestions: string[];
			wrongQuestions: string[];
			correctBalance: number;
			wrongBalance: number;
		};
	}[];
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface GroupMember {
	name: string;
	isActive: boolean;
	_id: string;
	group: string;
	__v: number;
}

export interface Powerup {
	name: string;
	displayName: string;
	description: string;
	icon: string;
	customTag: string;
	color: {
		background: string,
		text: string;
	};
	baseCost: number;
	percentageCost: number;
}

export interface Upgrade {
	name: string;
	description: string;
	icon: string;
	levels: {
		price: number;
		value: number;
	}[];
}