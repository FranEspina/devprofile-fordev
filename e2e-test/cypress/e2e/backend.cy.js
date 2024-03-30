describe('Prueba sobre el Backend', () => {
  it('La API debe contestar a una llamada de prueba', () => {
    cy.request('http://localhost:3000/test/ping')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq('pong');
      });
  });

  it('login', () => {
    cy.visit('http://localhost:4321')
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


