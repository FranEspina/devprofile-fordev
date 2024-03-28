
import { defineMiddleware } from "astro/middleware";
import { TOKEN, ID, PUBLIC_ROUTES } from "./constant";
import { jwtVerifyAsync } from "./services/apiService";
import { EVENTS_UPDATE } from "./components/ZustandStoreProvider";

interface authorizatioResult {
  status: "authorized" | "unauthorized" | "error",
  msg: string,
}

const verifyAuth = async (token?: string): Promise<authorizatioResult> => {
  if (!token) {
    return {
      status: "unauthorized",
      msg: "please pass a request token",
    } as const;
  }

  try {

    const jwtVerifyResult = await jwtVerifyAsync(token);
    if (jwtVerifyResult.success) {
      return {
        status: "authorized",
        msg: "successfully verified auth token",
      } as const;
    }

    return {
      status: "unauthorized",
      msg: "Unverified auth token",
    } as const;



  } catch (err) {
    console.log(err);
    return { status: "error", msg: "could not validate auth token" } as const;
  }
};


export const onRequest = defineMiddleware(async (context, next) => {
  context.locals.user = {
    id: '',
    token: ''
  }

  let token = ''
  let userId = ''
  if (context && context.cookies) {
    if (context.cookies.has(TOKEN)) {
      token = context.cookies.get(TOKEN)?.value ?? ''
    }
    if (context.cookies.has(ID)) {
      userId = context.cookies.get(ID)?.value ?? ''
    }
  }

  console.log(context.url.pathname)

  let validationResult: authorizatioResult
  if (PUBLIC_ROUTES.includes(context.url.pathname)) {
    context.locals.user.token = token;
    context.locals.user.id = userId;
    return next();
  }
  else if (context.url.pathname === "/unauthorized" ||
    context.url.pathname === "/404") {
    validationResult = {
      status: "authorized",
      msg: "Página autorizada"
    }
  }
  else {
    validationResult = await verifyAuth(token);
  }

  switch (validationResult.status) {
    case "authorized":
      context.locals.user.token = token;
      context.locals.user.id = userId;
      if (context.url.pathname.startsWith("/unauthorized")) {
        return Response.redirect(new URL("/", context.url));
      }
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
        return Response.redirect(new URL("/unauthorized", context.url));
      }

    default:
      return Response.redirect(new URL("/unauthorized", context.url));
  }
});