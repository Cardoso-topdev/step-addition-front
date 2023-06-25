"use client";

import { getGeneratedSteps, saveGeneratedSteps } from "@/utils";
import { useCallback, useState } from "react";

type FormValues = {
  firstNumber: number;
  secondNumber: number;
};
export default function Home() {
  const [formValues, setFormValues] = useState<FormValues>({
    firstNumber: 0,
    secondNumber: 0,
  });
  const [stepsResult, setStepsResult] = useState<string>('');

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getGeneratedSteps({
      num1: formValues.firstNumber,
      num2: formValues.secondNumber
    }).then(result => {
      let resultData = result.data
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
          resultData[key] = JSON.stringify(resultData[key])
        }
      }
      setStepsResult(JSON.stringify(resultData, null, 2).replace(/\\/g, ''))
    })
  };

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSaveResult = useCallback(() => {
    saveGeneratedSteps({
      num1: formValues.firstNumber,
      num2: formValues.secondNumber,
      steps: stepsResult
    })
  }, [stepsResult])

  return (
    <main>
      <form onSubmit={handleSubmit} className="max-w-[600px] mx-auto mt-[100px]">
        <div className="mb-4 flex gap-[10px] items-center">
          <label
            htmlFor="firstNumber"
            className='block text-gray-700 font-bold mb-2 whitespace-nowrap'
          >
            First Number:
          </label>
          <input
            id="firstNumber"
            type="number"
            name="firstNumber"
            value={formValues.firstNumber}
            onChange={handleChange}
            required
            className='w-full rounded-md border p-2 text-right bg-gray-100'
          />
        </div>
        <div className="mb-4 flex gap-[10px] items-center">
          <label
            htmlFor="secondNumber"
            className="block text-gray-700 font-bold mb-2 whitespace-nowrap"
          >
            Second Number:
          </label>
          <input
            id="secondNumber"
            type="number"
            name="secondNumber"
            value={formValues.secondNumber}
            onChange={handleChange}
            required
            className="w-full rounded-md border p-2 text-right bg-gray-100"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-end flex"
          >
            Generate Steps
          </button>
        </div>
        <textarea
          readOnly
          className="resize-none w-full border rounded-md p-2 mt-10 bg-gray-100"
          rows={10}
          value={stepsResult}
        />
        <div className="flex justify-end">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded justify-end flex"
            onClick={onSaveResult}
          >
            Save results to DB
          </button>
        </div>
      </form>
    </main>
  );
}
