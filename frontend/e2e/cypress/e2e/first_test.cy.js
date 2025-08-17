/// <reference types="Cypress"/>

context("Actions", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/templates");
  });

  it.skip("click first template item", () => {
    // https://on.cypress.io/type
    // cy.get(".templateArea")
    //   .type("fake@email.com")
    //   .should("have.value", "fake@email.com");

    // cy.wait(1000);

    cy.get("#firstContact").click();

    // cy.get(".templateArea").should(
    //   "have.value",
    //   "<div>Hello {{firstName}},<br><br>\n    I want to follow up on my last email with my cash offer to buy your house at {{address}} in {{city}}, {{state}}.<br><br>\n    My cash offer is {{offerPrice}} as-is.<br><br>\n  Please feel free to respond by email or give me a call at {{senderPhone}} to discuss the deal.<br>\n  <br>\n  Thank you,<br><br>\n  {{sender}}</div>"
    // );
  });

  it("click second template item", () => {
    // cy.wait(1000);

    // https://on.cypress.io/type
    // cy.get(".templateArea")
    //   .type("fake@email.com")
    //   .should("have.value", "fake@email.com");

    cy.get("#initialOffer").click();

    cy.get(".templateArea").should(
      "have.value",
      "<div>Hello {{firstName}},<br><br>\n    I want to follow up on my last email with my cash offer to buy your house at {{address}} in {{city}}, {{state}}.<br><br>\n    My cash offer is {{offerPrice}} as-is.<br><br>\n  Please feel free to respond by email or give me a call at {{senderPhone}} to discuss the deal.<br>\n  <br>\n  Thank you,<br><br>\n  {{sender}}</div>"
    );
  });
});
