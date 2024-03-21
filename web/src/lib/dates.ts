export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  const fechaFormateada = date
    .toLocaleDateString("es-es", options)
    .toUpperCase();
  return fechaFormateada;
};

export const yearDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { year: "numeric" };
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

  const diferenciaEnMilisegundos: number = Math.abs(toDate.getTime() - fromDate.getTime());
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

export function dateUtcToIso8601(utc: Date) {

  // const fecha = new Date(Date.UTC(2024, 3, 18, 23, 0, 0))
  // console.log(fecha.toLocaleDateString('es-ES', { timeZone: 'UTC' })) //Zona UTC: 2024-04-18
  // console.log(fecha.toLocaleDateString('sv', { timeZone: 'Europe/Madrid' })) //2024-04-19
  // console.log(fecha.toLocaleDateString('sv')) //Al no poner zona usa la local: 2024-04-19

  //This works because the Swedish language locale (svenska) uses the ISO 8601 format.
  return utc.toLocaleDateString('sv', { timeZone: 'Europe/Madrid' })
}

export function localIso8601ToUtcDate(iso8601Date: string | undefined | null) {
  if (!iso8601Date) return undefined
  const [year, month, day] = iso8601Date.split("-")
  return new Date(Number(year), Number(month) - 1, Number(day), 1, 0, 0, 0)
}