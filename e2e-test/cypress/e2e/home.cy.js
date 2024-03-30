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

  it.only('login', () => {
    cy.visit('httpº://localhost:4321')
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/login',
      body: {
        email: 'franpies77@gmail.com',
        password: 'clave',
      }
    })
      .then((response) => {
        expect(response.status).to.eq(200);

        const user = response.body.data
        const token = response.body.token

        localStorage.setItem('user', user)
        localStorage.setItem('token', token)

        cy.log(token)


      });

    cy.visit('http://localhost:4321')


  });

});


