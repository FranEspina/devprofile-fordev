export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short" };
  const fechaFormateada = date
    .toLocaleDateString("es-es", options)
    .toUpperCase();
  return fechaFormateada;
};

export const yearDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options = { year: "numeric" };
  const fechaFormateada = date
    .toLocaleDateString("es-es", options)
    .toUpperCase();
  return fechaFormateada;
}

export function formatYearInterval(from: string, to: string) {
  const options = { year: "numeric", month: "short" };
  let desc: string = ''
  if (!from) {
    if (!to) {
      return `Hasta ${yearDate(to)}`
    }
    return ''
  }

  if (to) {
    return `${yearDate(from)} - ${yearDate(to)}`
  }

  return `Desde ${yearDate(from)}`

}

export const diffDate = (from: string, to: string) => {
  if (!from) return "";
  if (!to) return "Actualmente";
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const diferenciaEnMilisegundos = Math.abs(toDate - fromDate);
  const diferenciaEnAnios = Math.floor(
    diferenciaEnMilisegundos / (365 * 24 * 60 * 60 * 1000),
  );
  const diferenciaEnMeses = Math.floor(
    (diferenciaEnMilisegundos % (365 * 24 * 60 * 60 * 1000)) /
    (30 * 24 * 60 * 60 * 1000),
  );

  let diferencia = "";
  if (diferenciaEnAnios > 0) {
    diferencia = `${diferenciaEnAnios} ${diferenciaEnAnios === 1 ? "año" : "años"} `;
  }
  if (diferenciaEnMeses > 0) {
    diferencia += `${diferenciaEnMeses} ${diferenciaEnMeses === 1 ? "mes" : "meses"} `;
  }
  return diferencia;
};