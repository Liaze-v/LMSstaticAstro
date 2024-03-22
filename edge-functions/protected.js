

export default async (req, context) => {

  let myHeaders = new Headers({
    "Content-Type": "text/html",
    "Location": "/formation",
  });
  const nfjwt = context.cookies.get("nf_jwt")
  const user_data = JSON.parse(context.cookies.get("user_data"))
  if (nfjwt == undefined) return new Response(null, {status: 303, headers: myHeaders});
  console.log("nfjwt ", nfjwt);
  if (user_data.userRoles[0] == "free") return new Response(null, {status: 303, headers: myHeaders});
  console.log("user_data.userRoles[0] ", user_data.userRoles[0]);
  console.log("user_data ", user_data);

  // example
  // user_data  {
  //   userRoles: [ "free" ],
  //   userEmail: "qsda564zeaze@qzerfde.com",
  //   userId: "f013abb2-da6f-4zee-8f79-e7764d35a359",
  //   userMetadata: { full_name: "name" }
  // }


  const fa = Netlify.env.get("FAUNADB_SERVER_SECRET");
  // const textResponse = await fetch('https://graphql.eu.fauna.com/graphql', {
  //   method: 'POST',
  //   headers: {
  //     Authorization: `Bearer ${process.env.FAUNADB_SERVER_SECRET}`,
  //   },
  //   body: JSON.stringify({
  //     query,
  //     variables,
  //   }),
  // })
  //   .then((res) => res.json())
  //   .catch((err) => console.error(JSON.stringify(err, null, 2)));
    
    console.dir(context)

    const url = new URL(req.url);
    // const protectedRoutes = new URLPattern({pathname: '/formation-pro/*:jpg'});
    const protectedRoutes = new URLPattern({pathname: '/formation-pro/*'});
    const match = protectedRoutes.exec(url);
    const auth = url.searchParams.has('auth');
    
    // if(match && !auth) return new Response(null, {status: 403});
    if(match && !auth) return new Response(null, {status: 303, headers: myHeaders});
    return;
  };