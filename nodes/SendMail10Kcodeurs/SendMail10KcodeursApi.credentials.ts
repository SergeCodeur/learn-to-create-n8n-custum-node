import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SendMail10KcodeursApi implements ICredentialType {
	name = 'sendMail10KcodeursApi';
	displayName = 'SendMail 10Kcodeurs API';
	documentationUrl = 'sendMail10Kcodeurs';
	properties: INodeProperties[] = [
		{
			displayName: 'User',
			name: 'user',
			type: 'string',
			default: '',
			placeholder: 'name@email.com',
			description: 'Adresse email pour l\'authentification SMTP',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Mot de passe pour l\'authentification SMTP',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			placeholder: 'smtp.gmail.com',
			description: 'Serveur SMTP à utiliser',
		},
		{
			displayName: 'Port',
			name: 'port',
			type: 'number',
			default: 465,
			description: 'Port du serveur SMTP',
		},
		{
			displayName: 'Secure',
			name: 'secure',
			type: 'boolean',
			default: true,
			description: 'Whether to use SSL/TLS for the connection',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'allowUnauthorizedCerts',
			type: 'boolean',
			default: false,
			description: 'Whether to connect even if SSL certificate validation is not possible',
		},
	];
}