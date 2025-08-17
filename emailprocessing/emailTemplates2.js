const firstContact = {
  id: "firstContact",
  name: "First Contact",
  emailSubject: `Investor interested in buy your house at {{address}} in {{city}}, {{state}}`,
  emailBody: `Hello {{firstName}},
My name is {{
    sender.split(" ")[0]
  }} and I'm an investor interested in buying your house at {{address}} in {{city}}, {{state}}.
I'd like to make a cash offer for the house as-is.
Please feel free to respond by email or give me a call at {{senderPhone}}.

Thank you,
{{sender}}`,

  htmlBody: `<div>Hello {{firstName}},<br><br>
My name is {{
    sender.split(" ")[0]
  }} and I'm an investor interested in buying your house at {{address}} in {{city}}, {{state}}. I'd like to make a cash offer for the house as-is.<br><br>
Please feel free to respond by email or give me a call at {{senderPhone}}.<br>
<br>
Thank you,<br><br>
{{sender}}</div>`,
};

const initialOffer = {
  id: "initialOffer",
  name: "Initial Offer",
  emailSubject: `Attached is my offer to buy your house at {{address}} in {{city}}, {{state}}`,
  emailBody: `Hello {{firstName}},
  I want to follow up on my last email with my cash offer to buy your house at {{address}} in {{city}}, {{state}}.

  My cash offer is {{offerPrice}} as-is.

  Please feel free to respond by email or give me a call at {{senderPhone}} to discuss the deal.
  
  Thank you,
  {{sender}}`,

  htmlBody: `<div>Hello {{firstName}},<br><br>
    I want to follow up on my last email with my cash offer to buy your house at {{address}} in {{city}}, {{state}}.<br><br>
    My cash offer is {{offerPrice}} as-is.<br><br>
  Please feel free to respond by email or give me a call at {{senderPhone}} to discuss the deal.<br>
  <br>
  Thank you,<br><br>
  {{sender}}</div>`,
};

module.exports = { firstContact, initialOffer };
