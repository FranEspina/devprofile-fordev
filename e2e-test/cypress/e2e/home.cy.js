describe('Prueba de página de inicio y ping al Backend', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4321');
  })

  it('Debe ver la página de bienvenida', () => {
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

  //login con usuario test en entorno development
  it.only('Login correcto', () => {
    cy.get('[data-cy="open-modal-sign-button"]')
      .wait(1000)
      .click();
    cy.get('[name="email"]').type('admin@correo.es')
    cy.get('[name="password"]').type('admin')


    cy.intercept('POST', 'http://localhost:3000/auth/login').as('responseLogin')
    cy.get('[data-cy="confirm-sign-button"]').click()
    cy.wait('@responseLogin').its('response.statusCode').should('be.oneOf', [200])

  });







});


