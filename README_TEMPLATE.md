# n8n-nodes-sendmail-10kcodeurs

This is an n8n community node. It lets you send emails via SMTP with advanced features and optional email archiving in your n8n workflows.

SendMail 10Kcodeurs is a comprehensive email sending solution that provides SMTP email delivery with enhanced features like custom headers, inline images, multiple attachment formats, and automatic email archiving capabilities.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Configuration Options](#configuration-options)  
[Advanced Features](#advanced-features)  
[Troubleshooting](#troubleshooting)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

Use the package name: `n8n-nodes-sendmail-10kcodeurs`

## Operations

The SendMail 10Kcodeurs node supports the following operations:

- **Send Email**: Send emails via SMTP with full customization options including:
  - Multiple recipients (TO, CC, BCC)
  - HTML and/or plain text content
  - File attachments with inline image support
  - Custom email headers
  - Priority settings
  - Email archiving and logging

## Credentials

To use this node, you need to configure SMTP credentials for your email service provider.

### Prerequisites
- An email account with SMTP access enabled
- SMTP server details from your email provider

### Supported Email Providers
The node automatically detects and optimizes settings for:
- Gmail (smtp.gmail.com)
- Outlook/Hotmail (smtp-mail.outlook.com)
- Custom SMTP servers

### Credential Configuration
Set up your SMTP credentials with the following information:

| Field | Description | Example |
|-------|-------------|---------|
| **User** | Your email address for SMTP authentication | `your-email@gmail.com` |
| **Password** | Your email password or app-specific password | `your-password` |
| **Host** | SMTP server hostname | `smtp.gmail.com` |
| **Port** | SMTP server port | `465` (SSL) or `587` (TLS) |
| **Secure** | Use SSL/TLS encryption | `true` for port 465, `false` for port 587 |
| **Ignore SSL Issues** | Allow connections with invalid certificates | `false` (recommended) |

### Provider-Specific Setup

#### Gmail
1. Enable 2-factor authentication
2. Generate an App Password: [Google Account Settings](https://myaccount.google.com/apppasswords)
3. Use the App Password in the credential configuration

#### Outlook/Hotmail
1. Use your regular email and password
2. Ensure "Less secure app access" is enabled if required

#### Custom SMTP
1. Contact your email provider for SMTP settings
2. Configure the exact host, port, and security settings as provided

## Compatibility

- **Minimum n8n version**: 1.0.0
- **Tested with**: n8n versions 1.0.0 - 1.x.x
- **Node.js**: Requires Node.js 18+ (due to nodemailer dependency)

## Usage

### Basic Email Sending

1. **Configure Credentials**: Set up your SMTP credentials first
2. **Set Recipients**: Enter email addresses in the TO field (comma-separated for multiple recipients)
3. **Compose Your Email**: Add subject and content (HTML or plain text)
4. **Send**: Execute the workflow

### Example Workflow
```
Trigger → SendMail 10Kcodeurs → [Success/Failure handling]
```

### Working with Dynamic Content
Use n8n expressions to insert dynamic data:
```
Subject: Order #{{$json.orderId}} Confirmation
HTML: <h1>Hello {{$json.customerName}}</h1>
```

## Configuration Options

### Basic Settings
- **From Email**: Sender's email address (required)
- **From Name**: Display name for the sender (optional)
- **To Email**: Recipient email addresses (required, comma-separated)
- **CC Email**: Carbon copy recipients (optional)
- **BCC Email**: Blind carbon copy recipients (optional)
- **Subject**: Email subject line (required)

### Content Format
Choose from three email formats:
- **Plain Text**: Text-only emails
- **HTML**: Rich HTML emails with formatting
- **Both**: Includes both plain text and HTML versions

### Advanced Options
- **Priority**: Set email priority (Low, Normal, High)
- **Reply To**: Specify a different reply-to address
- **Return Path**: Configure bounce handling address
- **Timeout**: Set connection timeout (default: 30 seconds)
- **Custom Headers**: Add custom SMTP headers

## Advanced Features

### File Attachments
1. Use the **Read Binary File** node or similar to load files
2. Configure attachments in the SendMail node:
   - **Property Name**: The binary property name (e.g., "data")
   - **File Name**: Display name for the attachment
   - **Content-ID**: For inline images in HTML emails

### Inline Images
For HTML emails with embedded images:
1. Set a **Content-ID** for your image attachment (e.g., "logo")
2. Reference it in HTML: `<img src="cid:logo" alt="Logo">`

### Email Archiving
Enable email archiving to save sent emails:
- **Save Format**: Choose JSON, EML, or both
- **Save Path**: Directory path for archived emails
- **File Naming**: Automatic timestamped filenames

### Custom Headers
Add custom SMTP headers for:
- Tracking pixels
- Marketing automation
- Email categorization
- Custom metadata

Example custom headers:
```
X-Campaign-ID: newsletter-2024-01
X-Priority: 1
List-Unsubscribe: <mailto:unsubscribe@example.com>
```

## Troubleshooting

### Common Issues

#### Authentication Failures
- **Gmail**: Use App Passwords instead of your regular password
- **Outlook**: Ensure account allows SMTP access
- **Custom SMTP**: Verify credentials and server settings

#### Connection Timeouts
- Increase the timeout setting in advanced options
- Check firewall rules and network connectivity
- Verify SMTP server availability

#### SSL/TLS Errors
- For self-signed certificates, enable "Ignore SSL Issues"
- Ensure correct port settings (465 for SSL, 587 for TLS)
- Check if your SMTP provider requires specific security settings

#### Large Attachments
- Most SMTP servers limit email size (typically 25MB)
- Consider using file sharing links for large files
- Monitor server response for size-related rejections

### Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid login" | Wrong credentials | Verify username/password, use App Passwords for Gmail |
| "Connection timeout" | Server unreachable | Check host/port settings, increase timeout |
| "Message too large" | Attachment/email too big | Reduce attachment size or use file links |
| "Recipient rejected" | Invalid email address | Verify recipient email format |

### Debugging Tips
1. Enable "Continue on Fail" to handle errors gracefully
2. Check the node output for detailed error information
3. Test with a simple email first, then add complexity
4. Use email archiving to debug content issues

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Nodemailer documentation](https://nodemailer.com/about/) (underlying email library)
- [SMTP Configuration Guides](https://www.mailgun.com/blog/which-smtp-port-understanding-ports-25-465-587/)
- [Email Standards RFC5322](https://tools.ietf.org/html/rfc5322)

### Provider Documentation
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Outlook SMTP Settings](https://support.microsoft.com/en-us/office/pop-imap-and-smtp-settings-8361e398-8af4-4e97-b147-6c6c4ac95353)

## Version History

### Version 1.0.0 (Current)
**Initial Release**
- SMTP email sending with authentication
- Support for HTML and plain text emails
- File attachment support with inline images
- Multiple recipient types (TO, CC, BCC)
- Email archiving in JSON and EML formats
- Custom header support
- Configurable timeouts and error handling
- Auto-detection for popular email providers
- Comprehensive validation and error messages

**Features:**
- ✅ Multi-format email support (HTML/Text/Both)
- ✅ File attachments with Content-ID support
- ✅ Custom SMTP headers
- ✅ Email archiving and logging
- ✅ Provider-specific optimizations
- ✅ Comprehensive error handling
- ✅ Timeout configuration
- ✅ Return path and reply-to settings

**Compatibility:**
- n8n 1.0.0+
- Node.js 18+
- All major SMTP providers

---

## Contributing

Found a bug or want to suggest a feature? Please create an issue in the project repository.

## License

This project is licensed under the same license as n8n - [Fair Code License](https://docs.n8n.io/reference/license/).
