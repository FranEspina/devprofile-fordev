describe('Prueba de página de inicio y ping al Backend', () => {
  it('Debe ver la página de bienvenida', () => {
    cy.visit('http://localhost:4321');
    cy.contains('Comparte tu experiencia');
  });


  it('Usuario anónimo, pagina con autorización, debe redireccionar al inicio', () => {
    cy.visit('http://localhost:4321/curriculum/');
    cy.contains('Tu Perfil').should('not.exist');
    cy.url().should('eq', 'http://localhost:4321/');
  });


  it('Usuario anónimo, pagina NO existe, debe redireccionar al inicio', () => {
    cy.visit('http://localhost:4321/pagina no existe/');
    cy.url().should('eq', 'http://localhost:4321/');
  });

  // it('Login del usuario', () => {
  //   cy.visit('http://localhost:4321/');
  //   cy.get('#modal-iniciar-sesion', { timeout: 10000 }).eq(0)
  //     .click({ force: true })
  //   cy.get('#modal-boton-aceptar', { timeout: 10000 }).eq(0)
  //     .click({ force: true })
  // });


});


