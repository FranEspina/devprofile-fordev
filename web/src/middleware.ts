
import { defineMiddleware } from "astro/middleware";
import { TOKEN, ID, PUBLIC_ROUTES } from "./constant";

const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

const verifyAuth = async (token?: string) => {
  if (!token) {
    return {
      status: "unauthorized",
      msg: "please pass a request token",
    } as const;
  }

  try {

    //TODO: Verificar el token contra el api del backend
    //const jwtVerifyResult = await jwtVerify(token, secret);
    // return {
    //   status: "authorized",
    //   payload: jwtVerifyResult.payload,
    //   msg: "successfully verified auth token",
    // } as const;

    return {
      status: "authorized",
      payload: null,
      msg: "successfully verified auth token",
    } as const;

  } catch (err) {
    console.log(err);
    return { status: "error", msg: "could not validate auth token" } as const;
  }
};


export const onRequest = defineMiddleware(async (context, next) => {
  // Ignore auth validation for public routes

  context.locals.user = {
    id: '',
    token: ''
  }

  let token = ''
  if (context.cookies.has(TOKEN)) {
    token = context.cookies.get(TOKEN).value
  }

  let userId = ''
  if (context.cookies.has(ID)) {
    userId = context.cookies.get(ID).value
  }

  if (PUBLIC_ROUTES.includes(context.url.pathname)) {
    context.locals.user.token = token;
    context.locals.user.id = userId;
    return next();
  }
  const validationResult = await verifyAuth(token);

  switch (validationResult.status) {
    case "authorized":
      context.locals.user.token = token;
      context.locals.user.id = userId;
      return next();

    case "error":
    case "unauthorized":
      if (context.url.pathname.startsWith("/api/")) {
        return new Response(JSON.stringify({ message: validationResult.msg }), {
          status: 401,
        });
      }
      // otherwise, redirect to the root page for the user to login
      else {
        return Response.redirect(new URL("/", context.url));
      }

    default:
      return Response.redirect(new URL("/", context.url));
  }
});