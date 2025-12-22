const { subscribeToQueue } = require('./broker');
const { sendEmail } = require('../email');

module.exports = function () {

    subscribeToQueue('AUTH_NOTIFICATION.USER_CREATED', async (data) => {

        const customerName =
            `${data.fullName?.firstName || ''} ${data.fullName?.lastName || ''}`.trim();

        const emailHTMLTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
                <h2 style="color: #2c3e50;">Welcome to SuperNova 🚀</h2>

                <p>Hi <strong>${customerName || 'there'}</strong>,</p>

                <p>
                    We're excited to have you onboard! Your SuperNova account has been
                    successfully created.
                </p>

                <p>
                    You can now explore the platform and start using all available features.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p>
                    If you ever need help, just reply to this email — we’re here for you.
                </p>

                <p style="margin-top: 30px;">
                    Best regards,<br/>
                    <strong>The SuperNova Team</strong>
                </p>

                <p style="font-size: 12px; color: #888;">
                    This is an automated email confirming your account registration.
                </p>
            </div>
        `;

        await sendEmail(
            data.email,
            'Welcome to SuperNova!',
            'Your SuperNova account has been created successfully',
            emailHTMLTemplate
        );
    });

    subscribeToQueue('AUTH_NOTIFICATION.USER_LOGGED_IN', async (data) => {

        const customerName =
            `${data.fullName?.firstName || ''} ${data.fullName?.lastName || ''}`.trim();

        const loginTime = new Date().toLocaleString();

        const emailHTMLTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
                <h2 style="color: #c0392b;">New Login Detected 🔐</h2>

                <p>Hi <strong>${customerName || 'there'}</strong>,</p>

                <p>
                    We noticed a successful login to your SuperNova account with the
                    following details:
                </p>

                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0;"><strong>Date & Time</strong></td>
                        <td style="padding: 8px 0;">${loginTime}</td>
                    </tr>
                    ${data.ipAddress ? `
                    <tr>
                        <td style="padding: 8px 0;"><strong>IP Address</strong></td>
                        <td style="padding: 8px 0;">${data.ipAddress}</td>
                    </tr>` : ''}
                    ${data.userAgent ? `
                    <tr>
                        <td style="padding: 8px 0;"><strong>Device</strong></td>
                        <td style="padding: 8px 0;">${data.userAgent}</td>
                    </tr>` : ''}
                </table>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p>
                    <strong>If this was you</strong>, no further action is required.
                </p>

                <p>
                    <strong>If this wasn’t you</strong>, please reset your password
                    immediately and contact support.
                </p>

                <p style="margin-top: 30px;">
                    Stay safe,<br/>
                    <strong>The SuperNova Security Team</strong>
                </p>

                <p style="font-size: 12px; color: #888;">
                    This security alert was generated automatically.
                </p>
            </div>
        `;

        await sendEmail(
            data.email,
            'Security Alert: New Login Detected',
            'We detected a new login to your SuperNova account',
            emailHTMLTemplate
        );
    });

    subscribeToQueue('PAYMENT_NOTIFICATION.PAYMENT_COMPLETED', async (data) => {

        const customerName =
            `${data.fullName?.firstName || ''} ${data.fullName?.lastName || ''}`.trim();

        const emailHTMLTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
                <h2 style="color: #2c3e50;">Payment Successful 🎉</h2>

                <p>Hi <strong>${customerName || 'there'}</strong>,</p>

                <p>
                    Thank you for your payment. Your transaction has been completed
                    successfully.
                </p>

                <hr style="border: none; border-top: 1px solid #eee;" />

                <h3>Payment Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0;"><strong>Order ID</strong></td>
                        <td style="padding: 8px 0;">${data.orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;"><strong>Payment ID</strong></td>
                        <td style="padding: 8px 0;">${data.paymentId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;"><strong>Amount Paid</strong></td>
                        <td style="padding: 8px 0;">
                            ${data.currency?.toUpperCase()} ${data.amount}
                        </td>
                    </tr>
                </table>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p>
                    If you have any questions, feel free to reply to this email.
                </p>

                <p style="margin-top: 30px;">
                    Best regards,<br/>
                    <strong>The SuperNova Team</strong>
                </p>

                <p style="font-size: 12px; color: #888;">
                    This is an automated payment confirmation.
                </p>
            </div>
        `;

        await sendEmail(
            data.email,
            'Payment Successful',
            `Your payment of ${data.currency?.toUpperCase()} ${data.amount} was successful`,
            emailHTMLTemplate
        );
    });

    subscribeToQueue('PAYMENT_NOTIFICATION.PAYMENT_FAILED', async (data) => {

        const customerName =
            `${data.fullName?.firstName || ''} ${data.fullName?.lastName || ''}`.trim();

        const emailHTMLTemplate = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
                <h2 style="color: #e74c3c;">Payment Failed ❌</h2>

                <p>Hi <strong>${customerName || 'there'}</strong>,</p>

                <p>
                    Unfortunately, your recent payment attempt could not be completed.
                </p>

                <hr style="border: none; border-top: 1px solid #eee;" />

                <h3>Payment Attempt Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0;"><strong>Order ID</strong></td>
                        <td style="padding: 8px 0;">${data.orderId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0;"><strong>Payment ID</strong></td>
                        <td style="padding: 8px 0;">${data.paymentId}</td>
                    </tr>
                </table>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

                <p>
                    No amount has been deducted from your account.
                    You may try again or use a different payment method.
                </p>

                <p>
                    If the issue persists, please contact our support team.
                </p>

                <p style="margin-top: 30px;">
                    Best regards,<br/>
                    <strong>The SuperNova Team</strong>
                </p>

                <p style="font-size: 12px; color: #888;">
                    This is an automated notification regarding a failed payment attempt.
                </p>
            </div>
        `;

        await sendEmail(
            data.email,
            'Payment Failed',
            'Your payment attempt was unsuccessful',
            emailHTMLTemplate
        );
    });
};
