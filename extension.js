// @ts-nocheck
const { basename, extname } = require('path');
const { getIcon } = require('./util/helpers/getFileIcon');
const { window, commands, StatusBarAlignment } = require('vscode');
const vscode = require('vscode')
const { stat } = require('fs');
const clientId = '989074672161267762'
const RPC = require('discord-rpc')
let rpc;
let activityInterval;
let startTimestamp;

const statBar = window.createStatusBarItem(StatusBarAlignment.Left);

async function setAct() {
	const fileName = basename(window.activeTextEditor.document.fileName)
	const fileExt = extname(fileName).replace('.', '').toUpperCase()

	const langIcon = await getIcon(fileName)

	const currentLine = (window.activeTextEditor.selection.active.line + 1).toLocaleString()
	const currentCol = (window.activeTextEditor.selection.active.character + 1).toLocaleString()

	const presenceInfo = {
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
		instance: true
	}

	rpc.setActivity(presenceInfo)
}

async function login() {
	statBar.text = 'Connecting to Discord Gateway...'
	statBar.tooltip = 'Connecting to Discord Gateway...'

	rpc = new RPC.Client({
		transport: 'ipc'
	})

	rpc.on('ready', async () => {
		statBar.text = 'Connected to Discord Gateway'
		statBar.tooltip = 'Connected to Discord Gateway\nClick to Disconnect'
		statBar.command = 'shpresence.disconnect'
		statBar.show()

		activityInterval = setInterval(async () => {
			await setAct()
		}, 3000)
	})

	await rpc.login({ clientId })


}

// REGISTERING ALL OF THE EXTENSION's COMMAND
async function registerCommands(ctx) {

	// CONNECT COMMAND
	const connect = commands.registerCommand('shpresence.connect', function () {
		startTimestamp = new Date()
		login()
	})

	// DISCONNECT COMMAND
	const disconnect = commands.registerCommand('shpresence.disconnect', function () {
		statBar.text = 'Disconnected to Discord Gateway'
		statBar.tooltip = 'Disconnected to Discord Gateway\nClick to Connect'
		statBar.command = 'shpresence.connect'
		statBar.show()

		rpc.destroy()
		clearInterval(activityInterval)
	})


	ctx.subscription.push(connect, disconnect)
}


async function activate(ctx) {
	registerCommands(ctx)

	startTimestamp = new Date()
	await login()
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}
