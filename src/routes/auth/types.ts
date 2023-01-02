export type SignIn = {
  params: void,
  query: void,
  response: { token: string},
  body: {
    email: string
    password: string
  }
}

export type SingUp = {
  params: void,
  query: void,
  response: { token: string},
  body: {
    email: string
    password: string
    name: string,
  }
}