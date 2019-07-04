export function logger (msg: string | Error) {
  console.error(`[SV - ERROR]: ${msg.toString()}`)
}

export default logger