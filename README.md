# Gimkill
Gimkill is a tool that exploits poor design choices in [Gimkit](https://gimkit.com), an online quiz game commonly used in educational environments.
It allows you to, given a Gimkit game URL and a player's username, win the game in typically less than ten seconds automatically.
Gimkill does this by creating a Web Socket connection from Node like a normal player would in a browser, and then auto-answer each question correctly and auto-buy upgrades to max out your in-game cash very quickly.
This is caused in part by an issue in Gimkit where it sends all of the questions and their answers, including which answer is the correct one, to all clients.

# How to Use
Clone the repository and run `yarn`. If you don't have `yarn`, install it using `npm install --global yarn`. If you don't have `npm`, then install Node.js.

Once you have the packages installed, run `yarn start`. When prompted for the Gimkit game URL, it should be a URL like:
```
https://www.gimkit.com/play?a=0123456789abcdefABCDEFab&class=0123456789abcdefABCDEFab
```
Next, when asked for your name, enter the name of the user _exactly_ as it appears in the drop-down box when viewing the page in-browser (i.e., `Lucas`).
Currently, Gimkill only works for Kit assignments-- it has never been tested with different methods of delivering the Kits.

# Disclaimer
I have no connection to Gimkit and I am not responsible for anything Gimkit does, and vice versa. I do not own the rights to the Gimkit name or any of their intellectual property.
Although using Gimkill is not illegal, it's probably against the Gimkit TOS (although I've never read it so I can't say that with any authority whatsoever), or at minimum, if you're a student and you use this for an assignment your teacher might get you in trouble.
I made this because it was a fun project, and it does my homework for me, so I have it here on my GitHub to demonstrate the issues in Gimkit. Don't abuse it, and don't sue me!

# License
Copyright 2020 Lucas Baizer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
