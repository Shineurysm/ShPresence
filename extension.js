// @ts-nocheck
const presence = require('discord-rich-presence')('989074672161267762');
const { basename, extname } = require('path');
const { getIcon } = require('./util/helpers/getFileIcon');
const { window, commands, StatusBarAlignment } = require('vscode');
const { stat } = require('fs');

const statBar = window.createStatusBarItem(StatusBarAlignment.Left);

// SHOW THE CONNECT BUTTON
statBar.text = 'Connect to Discord Presence'
statBar.tooltip = 'This will connect you into Discord Presence Gateway'
statBar.show()

// REGISTERING ALL OF THE EXTENSION's COMMAND
async function registerCommands(ctx) {

	// CONNECT COMMAND
	const connect = commands.registerCommand('shpresence.connect', () => {

		// connecting text
		statBar.text = 'Connecting to Discord Presence.....'
		statBar.tooltip = 'Currently connecting you into Discord Presence'
		statBar.show()

		// extension's brain
		setInterval(() => {
			const fileName = path.basename(vscode.window.activeTextEditor.document.fileName)
			const fileExt = path.extname(fileName).replace('.', '').toUpperCase()

			const langIcon = await getIcon(fileName)

			const currentLine = (vscode.window.activeTextEditor.selection.active.line + 1).toLocaleString()
			const currentCol = (vscode.window.activeTextEditor.selection.active.character + 1).toLocaleString()


			function presence() {
				const presenceOptions = {
					details: `Editing ${fileName}`,
					state: `Ln ${currentLine}, Col ${currentCol}`,
					startTimestamp,
					largeImageKey: langIcon,
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

			presence()

		}, 2500)

		presence.on('ready', () => {
			statBar.text = 'Connected to Discord Presence'
			statBar.tooltip = 'Successfully connected to Discord Presence Gateway\n`Click again if you wish to disconnect out of Discord Presence`'
			statBar.commad = 'shpresence.disconnect'
			statBar.show()
		})
	})

	// DISCONNECT COMMAND
	const disconnect = commands.registerCommand('shpresence.disconnect', () => {
		statBar.text = 'Reconnect to Discord Presence'
		statBar.tooltip = 'You are currently disconencted out of Discord Presence\n`Click again if you wish to conenct to Discord Presence`'
		statBar.commad = 'shpresence.connect'
		statBar.show()
	})


	ctx.subscription.push(connect, disconnect)
}


function activate(ctx) {
	registerCommands(ctx)
}


function deactivate() { }

module.exports = {
	activate,
	deactivate
}
