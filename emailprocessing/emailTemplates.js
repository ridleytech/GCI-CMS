const firstContact = (address, city, state, firstName, senderPhone, sender) => {
  return {
    emailSubject: `Investor interested in buy your house at ${address} in ${city}, ${state}`,
    emailBody: `Hello ${firstName},
My name is ${
      sender.split(" ")[0]
    } and I'm an investor interested in buying your house at ${address} in ${city}, ${state}.
I'd like to make a cash offer for the house as-is.
Please feel free to respond by email or give me a call at ${senderPhone}.

Thank you,
${sender}`,

    htmlBody: `<div>Hello ${firstName},<br><br>
My name is ${
      sender.split(" ")[0]
    } and I'm an investor interested in buying your house at ${address} in ${city}, ${state}. I'd like to make a cash offer for the house as-is.<br><br>
Please feel free to respond by email or give me a call at ${senderPhone}.<br>
<br>
Thank you,<br><br>
${sender}</div>`,
  };
};

const initialOffer = (
  address,
  city,
  state,
  firstName,
  senderPhone,
  sender,
  offerPrice
) => {
  return {
    emailSubject: `Attached is my offer to buy your house at ${address} in ${city}, ${state}`,
    emailBody: `Hello ${firstName},
  I want to follow up on my last email with my cash offer to buy your house at ${address} in ${city}, ${state}.

  My cash offer is $${offerPrice} as-is.

  Please feel free to respond by email or give me a call at ${senderPhone} to discuss the deal.
  
  Thank you,
  ${sender}`,

    htmlBody: `<div>Hello ${firstName},<br><br>
    I want to follow up on my last email with my cash offer to buy your house at ${address} in ${city}, ${state}.<br><br>
    My cash offer is $${offerPrice} as-is.<br><br>
  Please feel free to respond by email or give me a call at ${senderPhone} to discuss the deal.<br>
  <br>
  Thank you,<br><br>
  ${sender}</div>`,
  };
};

const initialOffer1 = (
  address,
  city,
  state,
  firstName,
  senderPhone,
  sender,
  offerPrice
) => {
  return {
    emailSubject: `Attached is my offer to buy your house at ${address} in ${city}, ${state}`,
    emailBody: `Hello ${firstName},
  I wanted to follow up on my last email with my cash offer to buy your house at ${address} in ${city}, ${state} as-is.

  My offer is $${offerPrice}. That includes carrying, closing costs, and potential rehab costs for me for the deal. I'd like to set up a call to speak about some details of your property.

  Please feel free to respond by email or give me a call at ${senderPhone}.
  
  Thank you,
  ${sender}`,

    htmlBody: `<div>Hello ${firstName},<br><br>
    I wanted to follow up on my last email with my cash offer to buy your house at ${address} in ${city}, ${state} as-is.<br><br>
    My offer is $${offerPrice}. That includes carrying, closing costs, and potential rehab costs for me for the deal. I'd like to set up a call to speak about some details of your property.<br><br>
  Please feel free to respond by email or give me a call at ${senderPhone}.<br>
  <br>
  Thank you,<br><br>
  ${sender}</div>`,
  };
};

const test1 = "hello";

module.exports = { firstContact, initialOffer, test1 };
