describe('Prueba de página de inicio y ping al Backend', () => {
  it('Debe abrir la página de inicio', () => {
    cy.visit('http://localhost:4321');
    cy.contains('Comparte tu experiencia');
  });

  it('Debe hacer una llamada de prueba al backend', () => {
    cy.request('http://localhost:3000/test/ping')
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.eq('pong');
      });
  });
});
