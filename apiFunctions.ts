import { respuestaAPITelefono } from "./types.ts";


export async function verificarTelefono(telefono:string):Promise<respuestaAPITelefono> {
    const Api_Key = Deno.env.get("API_KEY")
    if(!Api_Key) throw new Error("Api key no encontrada")
    const url = "https://api.api-ninjas.com/v1/validatephone?number="+telefono
    const data = await fetch(url,{
        headers: {
            'X-Api-Key': Api_Key
          }
    })
    if(data.status !== 200) throw new Error("Respuesta de API phone no es 200")
    const response = await data.json()
    return {
        is_valid: response.is_valid,
        country: response.country,
        timezone: response.timezones[0]
    }
}

export async function geolocalizar(ciudad:string,pais: string):Promise<string[]> {
    const Api_Key = Deno.env.get("API_KEY")
    if(!Api_Key) throw new Error("Api key no encontrada")
    const url = "https://api.api-ninjas.com/v1/geocoding?city=" + ciudad +"&country="+ pais
    const data = await fetch(url,{
        headers: {
            'X-Api-Key': Api_Key
          }
    })
    if(data.status !== 200) throw new Error("Respuesta de API Geo no es 200")
    const response = await data.json()
    return [response[0].latitude,response[0].longitude]
}

export async function conseguirTemperatura(latitude:string,longitude:string):Promise<string> {
    const Api_Key = Deno.env.get("API_KEY")
    if(!Api_Key) throw new Error("Api key no encontrada")
    const url = "https://api.api-ninjas.com/v1/weather?lat="+latitude+"&lon="+longitude
    const data = await fetch(url,{
        headers: {
            'X-Api-Key': Api_Key
          }
    })
    if(data.status !== 200) throw new Error("Respuesta de API temp no es 200")
    const response = await data.json()
    return response.temp
}

export async function conseguirHora(timezone:string):Promise<string> {
    const Api_Key = Deno.env.get("API_KEY")
    if(!Api_Key) throw new Error("Api key no encontrada")
    const url = "https://api.api-ninjas.com/v1/worldtime?timezone="+timezone
    const data = await fetch(url,{
        headers: {
            'X-Api-Key': Api_Key
          }
    })
    if(data.status !== 200) throw new Error("Respuesta de API temp no es 200")
    const response = await data.json()
    return response.hour + ":"+response.minute
}