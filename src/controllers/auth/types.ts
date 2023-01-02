export type SignIn = {
  password: string,
  email: string
}

export type SignUp = {
  password: string,
  email: string,
  name?: string,
  slug?: string
}