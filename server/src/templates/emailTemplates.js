const appName = "CircuTrade";

const wrapHtml = ({ title, body }) => `
  <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 24px;">
    <div style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; color: #111827;">
      <h1 style="margin: 0 0 16px; font-size: 24px;">${title}</h1>
      ${body}
      <p style="margin-top: 24px; color: #6b7280; font-size: 14px;">
        ${appName}
      </p>
    </div>
  </div>
`;

export const buildBookingRequestOwnerEmail = ({
  ownerName,
  customerName,
  productTitle,
  startDate,
  endDate,
  customerPhone,
  customerAddress,
}) => ({
  subject: `Rental request for ${productTitle}`,
  text: [
    `Hi ${ownerName || "there"},`,
    "",
    `${customerName} is requesting to rent "${productTitle}" from ${startDate} to ${endDate}.`,
    `Phone: ${customerPhone}`,
    `Delivery address: ${customerAddress}`,
    "",
    "Please review the request in CircuTrade and respond with approval or alternate dates.",
  ].join("\n"),
  html: wrapHtml({
    title: `New rental request for ${productTitle}`,
    body: `
      <p>Hi ${ownerName || "there"},</p>
      <p><strong>${customerName}</strong> is requesting to rent <strong>${productTitle}</strong>.</p>
      <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
      <p><strong>Phone:</strong> ${customerPhone}</p>
      <p><strong>Delivery address:</strong> ${customerAddress}</p>
      <p>Please review the request in CircuTrade and respond with approval or alternate dates.</p>
    `,
  }),
});

export const buildBookingRequestCustomerEmail = ({
  customerName,
  productTitle,
  startDate,
  endDate,
}) => ({
  subject: `Your rental request for ${productTitle}`,
  text: [
    `Hi ${customerName || "there"},`,
    "",
    `We sent your rental request for "${productTitle}" from ${startDate} to ${endDate} to the owner.`,
    "You will receive another update when they respond.",
  ].join("\n"),
  html: wrapHtml({
    title: `Rental request sent`,
    body: `
      <p>Hi ${customerName || "there"},</p>
      <p>Your rental request for <strong>${productTitle}</strong> from <strong>${startDate}</strong> to <strong>${endDate}</strong> has been sent to the owner.</p>
      <p>We will notify you as soon as they respond.</p>
    `,
  }),
});

export const buildBookingDecisionCustomerEmail = ({
  customerName,
  productTitle,
  approved,
  startDate,
  endDate,
  alternateStartDate,
  alternateEndDate,
  ownerMessage,
}) => {
  const subject = approved
    ? `Your rental request for ${productTitle} was approved`
    : `Update on your rental request for ${productTitle}`;

  const decisionLine = approved
    ? `The owner approved your request for ${startDate} to ${endDate}.`
    : `The owner could not approve your requested dates.`;

  const alternateLine =
    !approved && alternateStartDate && alternateEndDate
      ? `Alternate dates offered: ${alternateStartDate} to ${alternateEndDate}.`
      : "";

  return {
    subject,
    text: [
      `Hi ${customerName || "there"},`,
      "",
      decisionLine,
      alternateLine,
      ownerMessage ? `Message from owner: ${ownerMessage}` : "",
      "",
      "Please log in to CircuTrade to continue.",
    ]
      .filter(Boolean)
      .join("\n"),
    html: wrapHtml({
      title: approved ? "Rental request approved" : "Rental request updated",
      body: `
        <p>Hi ${customerName || "there"},</p>
        <p>${decisionLine}</p>
        ${alternateLine ? `<p>${alternateLine}</p>` : ""}
        ${ownerMessage ? `<p><strong>Owner message:</strong> ${ownerMessage}</p>` : ""}
        <p>Please log in to CircuTrade to continue.</p>
      `,
    }),
  };
};
