import {
	ICredentialsDecrypted,
	ICredentialTestFunctions,
	IDataObject,
	IExecuteFunctions,
	INodeCredentialTestResult,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import * as nodemailer from 'nodemailer';

export class SendMail10Kcodeurs implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SendMail 10Kcodeurs',
		name: 'sendMail10Kcodeurs',
		icon: 'file:sendmail10kcodeurs.svg',
		group: ['output'],
		version: 1,
		description: 'Envoie des emails via SMTP avec sauvegarde optionnelle et gestion avancée',
		defaults: {
			name: 'SendMail 10Kcodeurs',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'sendMail10KcodeursApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				default: '',
				required: true,
				placeholder: 'admin@example.com',
				description: "Adresse email de l'expéditeur",
			},
			{
				displayName: 'From Name',
				name: 'fromName',
				type: 'string',
				default: '',
				placeholder: 'Mon Nom',
				description: "Nom de l'expéditeur (optionnel)",
			},
			{
				displayName: 'To Email',
				name: 'toEmail',
				type: 'string',
				default: '',
				required: true,
				description: 'Adresse(s) email du/des destinataire(s) (séparées par des virgules)',
			},
			{
				displayName: 'CC Email',
				name: 'ccEmail',
				type: 'string',
				default: '',
				description: 'Adresse(s) email en copie (optionnel)',
			},
			{
				displayName: 'BCC Email',
				name: 'bccEmail',
				type: 'string',
				default: '',
				description: 'Adresse(s) email en copie cachée (optionnel)',
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				default: '',
				required: true,
				placeholder: "Sujet de l'email",
				description: "Sujet de l'email",
			},
			{
				displayName: 'Email Format',
				name: 'emailFormat',
				type: 'options',
				options: [
					{
						name: 'Plain Text',
						value: 'text',
					},
					{
						name: 'HTML',
						value: 'html',
					},
					{
						name: 'Both',
						value: 'both',
					},
				],
				default: 'html',
				description: "Format de l'email",
			},
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					editor: 'codeNodeEditor',
					editorLanguage: 'text',
					rows: 5,
				},
				default: '',
				displayOptions: {
					show: {
						emailFormat: ['text', 'both'],
					},
				},
				description: "Version texte de l'email",
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				typeOptions: {
					editor: 'codeNodeEditor',
					editorLanguage: 'html',
					rows: 5,
				},
				default: '',
				displayOptions: {
					show: {
						emailFormat: ['html', 'both'],
					},
				},
				description: "Version HTML de l'email",
			},
			{
				displayName: 'Attachments',
				name: 'attachments',
				placeholder: 'Ajouter une pièce jointe',
				description: "Pièces jointes à inclure dans l'email",
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'attachment',
						displayName: 'Pièce Jointe',
						values: [
							{
								displayName: 'Property Name',
								name: 'property',
								type: 'string',
								default: 'data',
								description:
									'Nom de la propriété binaire qui contient les données de la pièce jointe',
							},
							{
								displayName: 'File Name',
								name: 'name',
								type: 'string',
								default: '',
								placeholder: 'data.pdf',
								description: 'Nom du fichier de la pièce jointe',
							},
							{
								displayName: 'Content-ID (For Inline Images)',
								name: 'cid',
								type: 'string',
								default: '',
								description: 'Content-ID pour les images intégrées dans le HTML',
							},
						],
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Ajouter une option',
				default: {},
				options: [
					{
						displayName: 'Custom Headers',
						name: 'customHeaders',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						description: "En-têtes personnalisés à ajouter à l'email",
						options: [
							{
								name: 'header',
								displayName: 'Header',
								values: [
									{
										displayName: 'Name',
										name: 'name',
										type: 'string',
										default: '',
										description: "Nom de l'en-tête",
									},
									{
										displayName: 'Value',
										name: 'value',
										type: 'string',
										default: '',
										description: "Valeur de l'en-tête",
									},
								],
							},
						],
					},
					{
						displayName: 'Priority',
						name: 'priority',
						type: 'options',
						options: [
							{
								name: 'Low',
								value: 'low',
							},
							{
								name: 'Normal',
								value: 'normal',
							},
							{
								name: 'High',
								value: 'high',
							},
						],
						default: 'normal',
						description: "Priorité de l'email",
					},
					{
						displayName: 'Reply To',
						name: 'replyTo',
						type: 'string',
						default: '',
						placeholder: 'reply@example.com',
						description: 'Adresse email pour les réponses',
					},
					{
						displayName: 'Return Path',
						name: 'returnPath',
						type: 'string',
						default: '',
						description: 'Adresse pour les bounces (optionnel)',
					},
					{
						displayName: 'Save Format',
						name: 'saveFormat',
						type: 'options',
						options: [
							{
								name: 'JSON',
								value: 'json',
							},
							{
								name: 'EML',
								value: 'eml',
							},
							{
								name: 'Both',
								value: 'both',
							},
						],
						default: 'json',
						displayOptions: {
							show: {
								saveSentEmail: [true],
							},
						},
						description: "Format de sauvegarde de l'email",
					},
					{
						displayName: 'Save Path',
						name: 'savePath',
						type: 'string',
						default: '/tmp/sent_emails',
						displayOptions: {
							show: {
								saveSentEmail: [true],
							},
						},
						description: 'Chemin où sauvegarder les emails envoyés',
					},
					{
						displayName: 'Save Sent Email',
						name: 'saveSentEmail',
						type: 'boolean',
						default: false,
						description: 'Whether to save the sent email to a file',
					},
					{
						displayName: 'Timeout (Seconds)',
						name: 'timeout',
						type: 'number',
						default: 30,
						description: "Timeout pour l'envoi de l'email en secondes",
					},
				],
			},
		],
	};

	methods = {
		credentialTest: {
			async sendMail10KcodeursConnectionTest(
				this: ICredentialTestFunctions,
				credential: ICredentialsDecrypted,
			): Promise<INodeCredentialTestResult> {
				const credentials = credential.data!;

				try {
					const transporter = createTransporter(credentials);
					await transporter.verify();

					return {
						status: 'OK',
						message: 'Connexion SMTP réussie!',
					};
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
					return {
						status: 'Error',
						message: `Connexion SMTP échouée: ${errorMessage}`,
					};
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const length = items.length;

		const credentials = await this.getCredentials('sendMail10KcodeursApi');
		const transporter = createTransporter(credentials);

		for (let itemIndex = 0; itemIndex < length; itemIndex++) {
			try {
				const item = items[itemIndex];

				// Validation des paramètres requis
				const fromEmail = this.getNodeParameter('fromEmail', itemIndex) as string;
				const toEmail = this.getNodeParameter('toEmail', itemIndex) as string;
				const subject = this.getNodeParameter('subject', itemIndex) as string;

				if (!fromEmail?.trim()) {
					throw new NodeOperationError(this.getNode(), 'From Email est requis', { itemIndex });
				}

				if (!toEmail?.trim()) {
					throw new NodeOperationError(this.getNode(), 'To Email est requis', { itemIndex });
				}

				if (!subject?.trim()) {
					throw new NodeOperationError(this.getNode(), 'Subject est requis', { itemIndex });
				}

				// Récupération des autres paramètres
				const fromName = this.getNodeParameter('fromName', itemIndex) as string;
				const ccEmail = this.getNodeParameter('ccEmail', itemIndex) as string;
				const bccEmail = this.getNodeParameter('bccEmail', itemIndex) as string;
				const emailFormat = this.getNodeParameter('emailFormat', itemIndex) as string;
				const options = this.getNodeParameter('options', itemIndex, {}) as IDataObject;

				const mailOptions: IDataObject = {
					from: fromName?.trim() ? `"${fromName.trim()}" <${fromEmail.trim()}>` : fromEmail.trim(),
					to: toEmail.trim(),
					subject: subject.trim(),
				};

				// Ajout des destinataires optionnels
				if (ccEmail?.trim()) {
					mailOptions.cc = ccEmail.trim();
				}

				if (bccEmail?.trim()) {
					mailOptions.bcc = bccEmail.trim();
				}

				// Gestion du contenu selon le format
				if (emailFormat === 'text' || emailFormat === 'both') {
					const textContent = this.getNodeParameter('text', itemIndex) as string;
					if (!textContent && emailFormat === 'text') {
						throw new NodeOperationError(
							this.getNode(),
							'Le contenu texte est requis pour le format "Plain Text"',
							{ itemIndex },
						);
					}
					mailOptions.text = textContent || '';
				}

				if (emailFormat === 'html' || emailFormat === 'both') {
					const htmlContent = this.getNodeParameter('html', itemIndex) as string;
					if (!htmlContent && emailFormat === 'html') {
						throw new NodeOperationError(
							this.getNode(),
							'Le contenu HTML est requis pour le format "HTML"',
							{ itemIndex },
						);
					}
					mailOptions.html = htmlContent || '';
				}

				// Options avancées
				if (options.replyTo) {
					mailOptions.replyTo = (options.replyTo as string).trim();
				}

				if (options.returnPath) {
					mailOptions.returnPath = (options.returnPath as string).trim();
				}

				if (options.priority && options.priority !== 'normal') {
					mailOptions.priority = options.priority as string;
				}

				// En-têtes personnalisés
				if (options.customHeaders) {
					const customHeaders = options.customHeaders as IDataObject;
					if (customHeaders.header && Array.isArray(customHeaders.header)) {
						const headers: IDataObject = {};
						for (const header of customHeaders.header as IDataObject[]) {
							if (header.name && header.value) {
								headers[header.name as string] = header.value as string;
							}
						}
						if (Object.keys(headers).length > 0) {
							mailOptions.headers = headers;
						}
					}
				}

				// Gestion des pièces jointes
				const attachments = this.getNodeParameter('attachments', itemIndex, {}) as IDataObject;
				if (attachments.attachment && Array.isArray(attachments.attachment)) {
					const attachmentsList: IDataObject[] = [];

					for (const attachment of attachments.attachment as IDataObject[]) {
						const propertyName = attachment.property as string;
						const fileName = attachment.name as string;
						const cid = attachment.cid as string;

						if (!propertyName) {
							throw new NodeOperationError(
								this.getNode(),
								'Property Name est requis pour les pièces jointes',
								{ itemIndex },
							);
						}

						if (item.binary && item.binary[propertyName]) {
							const attachmentData: IDataObject = {
								filename: fileName || propertyName,
								content: Buffer.from(item.binary[propertyName].data, 'base64'),
								contentType: item.binary[propertyName].mimeType,
							};

							if (cid?.trim()) {
								attachmentData.cid = cid.trim();
							}

							attachmentsList.push(attachmentData);
						}
					}

					if (attachmentsList.length > 0) {
						mailOptions.attachments = attachmentsList;
					}
				}

				// Configuration du timeout
				const timeout = (options.timeout as number) || 30;
				const timeoutPromise = new Promise((_, reject) => {
					setTimeout(() => reject(new Error(`Timeout après ${timeout} secondes`)), timeout * 1000);
				});

				// Envoi de l'email avec timeout
				const info = await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);

				// Sauvegarde de l'email si demandée
				if (options.saveSentEmail) {
					try {
						await saveSentEmail.call(this, mailOptions, info as any, options);
					} catch (saveError) {
						// Log l'erreur de sauvegarde mais ne fait pas échouer l'envoi
						console.warn("Erreur lors de la sauvegarde de l'email:", saveError);
					}
				}

				returnData.push({
					json: {
						messageId: (info as any).messageId,
						accepted: (info as any).accepted,
						rejected: (info as any).rejected,
						response: (info as any).response,
						envelope: (info as any).envelope,
						success: true,
						timestamp: new Date().toISOString(),
					},
					pairedItem: { item: itemIndex },
				});
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
					returnData.push({
						json: {
							error: errorMessage,
							success: false,
							timestamp: new Date().toISOString(),
						},
						pairedItem: { item: itemIndex },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex });
			}
		}

		return [returnData];
	}
}

async function saveSentEmail(
	this: IExecuteFunctions,
	mailOptions: IDataObject,
	info: any,
	options: IDataObject,
): Promise<void> {
	const savePath = (options.savePath as string) || '/tmp/sent_emails';
	const saveFormat = (options.saveFormat as string) || 'json';
	const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
	const messageId = info.messageId.replace(/[<>@]/g, '').substring(0, 20);

	// Créer le dossier de sauvegarde s'il n'existe pas
	try {
		await fs.mkdir(savePath, { recursive: true });
	} catch (error) {
		throw new NodeOperationError(
			this.getNode(),
			`Impossible de créer le dossier de sauvegarde: ${savePath}`,
		);
	}

	const emailData = {
		timestamp: new Date().toISOString(),
		messageId: info.messageId,
		from: mailOptions.from,
		to: mailOptions.to,
		cc: mailOptions.cc,
		bcc: mailOptions.bcc,
		subject: mailOptions.subject,
		text: mailOptions.text,
		html: mailOptions.html,
		replyTo: mailOptions.replyTo,
		returnPath: mailOptions.returnPath,
		priority: mailOptions.priority,
		headers: mailOptions.headers,
		attachments: mailOptions.attachments
			? (mailOptions.attachments as any[]).map((att: any) => ({
					filename: att.filename,
					contentType: att.contentType,
					size: att.content.length,
					cid: att.cid,
				}))
			: [],
		serverResponse: {
			accepted: info.accepted,
			rejected: info.rejected,
			response: info.response,
			envelope: info.envelope,
		},
	};

	const baseFileName = `${timestamp}_${messageId}`;

	try {
		if (saveFormat === 'json' || saveFormat === 'both') {
			const jsonFilePath = path.join(savePath, `${baseFileName}.json`);
			await fs.writeFile(jsonFilePath, JSON.stringify(emailData, null, 2), 'utf8');
		}

		if (saveFormat === 'eml' || saveFormat === 'both') {
			const emlContent = generateEMLContent(mailOptions);
			const emlFilePath = path.join(savePath, `${baseFileName}.eml`);
			await fs.writeFile(emlFilePath, emlContent, 'utf8');
		}
	} catch (error) {
		throw new NodeOperationError(
			this.getNode(),
			`Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
		);
	}
}

function generateEMLContent(mailOptions: IDataObject): string {
	const lines: string[] = [];

	lines.push(`From: ${mailOptions.from}`);
	lines.push(`To: ${mailOptions.to}`);

	if (mailOptions.cc) {
		lines.push(`Cc: ${mailOptions.cc}`);
	}

	if (mailOptions.bcc) {
		lines.push(`Bcc: ${mailOptions.bcc}`);
	}

	lines.push(`Subject: ${mailOptions.subject}`);
	lines.push(`Date: ${new Date().toUTCString()}`);
	lines.push(`Message-ID: ${Date.now()}@n8n.local`);

	if (mailOptions.replyTo) {
		lines.push(`Reply-To: ${mailOptions.replyTo}`);
	}

	if (mailOptions.returnPath) {
		lines.push(`Return-Path: ${mailOptions.returnPath}`);
	}

	// En-têtes personnalisés
	if (mailOptions.headers) {
		const headers = mailOptions.headers as IDataObject;
		for (const [name, value] of Object.entries(headers)) {
			lines.push(`${name}: ${value}`);
		}
	}

	lines.push('MIME-Version: 1.0');

	// Gestion du contenu multipart
	if (mailOptions.html && mailOptions.text) {
		const boundary = `boundary_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		lines.push(`Content-Type: multipart/alternative; boundary="${boundary}"`);
		lines.push('');

		lines.push(`--${boundary}`);
		lines.push('Content-Type: text/plain; charset=UTF-8');
		lines.push('Content-Transfer-Encoding: 8bit');
		lines.push('');
		lines.push(mailOptions.text as string);
		lines.push('');

		lines.push(`--${boundary}`);
		lines.push('Content-Type: text/html; charset=UTF-8');
		lines.push('Content-Transfer-Encoding: 8bit');
		lines.push('');
		lines.push(mailOptions.html as string);
		lines.push('');

		lines.push(`--${boundary}--`);
	} else if (mailOptions.html) {
		lines.push('Content-Type: text/html; charset=UTF-8');
		lines.push('Content-Transfer-Encoding: 8bit');
		lines.push('');
		lines.push(mailOptions.html as string);
	} else {
		lines.push('Content-Type: text/plain; charset=UTF-8');
		lines.push('Content-Transfer-Encoding: 8bit');
		lines.push('');
		lines.push((mailOptions.text as string) || '');
	}

	return lines.join('\r\n');
}

function createTransporter(credentials: IDataObject) {
	const config: any = {
		host: credentials.host as string,
		port: credentials.port as number,
		secure: credentials.secure as boolean,
		auth: {
			user: credentials.user as string,
			pass: credentials.password as string,
		},
		tls: {
			rejectUnauthorized: !(credentials.allowUnauthorizedCerts as boolean),
		},
		// Ajout d'options de performance et de fiabilité
		pool: false, // Désactive le pool de connexions pour éviter les problèmes
		maxConnections: 1,
		maxMessages: 100,
	};

	// Configuration spécifique pour certains fournisseurs
	const host = (credentials.host as string).toLowerCase();
	if (host.includes('gmail')) {
		config.service = 'gmail';
	} else if (host.includes('outlook') || host.includes('hotmail')) {
		config.service = 'hotmail';
	}

	return nodemailer.createTransport(config);
}
