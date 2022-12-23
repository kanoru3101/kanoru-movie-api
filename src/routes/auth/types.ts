export type SignIn = {
  params: void,
  query: void,
  response: { token: string},
  body: {
    email: string
    password: string
  }
}