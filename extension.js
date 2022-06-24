// @ts-nocheck
const vscode = require('vscode');
const presence = require('discord-rich-presence')('989074672161267762');
const path = require('path');
const { getIcon } = require('./util/helpers/getFileIcon');
const wait = require('node:timers/promises').setTimeout;
const statBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

async function activate(context) {
	statBar.text = 'Connect to Discord Presence'
	statBar.tooltip = 'Connect to Discord Rich Presence'
	statBar.command = 'test-extension.connect'
	statBar.show()
	let interval;

	let runPresence = vscode.commands.registerCommand('test-extension.connect', async function () {
		statBar.text = 'Connecting to presence....'
		statBar.tooltip = 'Please wait while I set some things up....'

		const startTimestamp = new Date()

		// UPDATE FILE
		interval = setInterval(async function () {
			const fileName = path.basename(vscode.window.activeTextEditor.document.fileName)
			const fileExt = path.extname(fileName).replace('.', '').toUpperCase()

			const key = await getIcon(fileName)

			const currentLine = (vscode.window.activeTextEditor.selection.active.line + 1).toLocaleString()
			const currentCol = (vscode.window.activeTextEditor.selection.active.character + 1).toLocaleString()


			function presencee() {
				const presenceOptions = {
					details: `💻 ${fileName}`,
					state: `Ln ${currentLine}, Col ${currentCol}`,
					startTimestamp,
					largeImageKey: key,
					largeImageText: `Editing ${fileExt} file`,
					smallImageKey: 'bot_pic',
					smallImageText: `Shinomy`,
					buttons: [
						{ label: 'Invite Shinomy', url: 'https://discord.com/api/oauth2/authorize?client_id=973561420488777790&permissions=8&scope=bot%20applications.commands' }
					],
					instance: true,
				}

				presence.updatePresence(presenceOptions)

			}

			await presencee()

			console.log('runnin')
		}, 2000)

		statBar.text = 'Successfully Connected to Discord Presence'
		statBar.tooltip = 'You\'re Connected to Discord Rich Presence || Click Again If You Want to Disconnect Out of Discord Presence'
		statBar.command = 'test-extension.disconnect'
		statBar.show()
	});

	const disconnectPresence = vscode.commands.registerCommand('test-extension.disconnect', async function () {
		await clearInterval(interval)
		await presence.disconnect()
		statBar.text = 'Disconnected Discord Presence'
		statBar.tooltip = 'You\'re Disconnected out of Discord Rich Presence || Click Again to Connect to Discord Rich Presence'
		statBar.command = 'test-extension.connect'
		statBar.show()
	})

	context.subscriptions.push(runPresence, disconnectPresence);
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
