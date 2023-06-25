import axios from "axios"

interface IFormDataParams {
  num1: number;
  num2: number;
}
interface IAdditionResult {
  num1: number;
  num2: number;
  steps: string
}
const url = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api/v1/entries/'
export const getGeneratedSteps = (data: IFormDataParams) => axios.post(url + 'generate', data)

export const saveGeneratedSteps = (data: IAdditionResult ) => axios.post(url, data)