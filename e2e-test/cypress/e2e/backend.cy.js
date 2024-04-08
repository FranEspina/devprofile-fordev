describe('Prueba sobre el Backend', () => {
  it('La API debe contestar a una llamada de prueba', () => {
    cy.request('http://localhost:3000/test/ping')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq('pong');
      });
  });

  //usuario de test en entorno desarrollo. se crea siempre al crear la bbdd
  it('login', () => {
    cy.visit('http://localhost:4321')
    cy.request({
      method: 'POST',
      url: 'http://localhost:3000/auth/login',
      body: {
        email: 'admin@correo.com',
        password: 'admin',
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


