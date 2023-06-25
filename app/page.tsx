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
  const [stepsResult, setStepsResult] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hasError, setError] = useState(false);

  const handleCloseAlert = () => {
    setShowAlert(false);
    setError(false)
  };
  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getGeneratedSteps({
      num1: formValues.firstNumber,
      num2: formValues.secondNumber,
    }).then((result) => {
      let resultData = result.data;
      for (const key in resultData) {
        if (resultData.hasOwnProperty(key)) {
          resultData[key] = JSON.stringify(resultData[key]);
        }
      }
      setStepsResult(JSON.stringify(resultData, null, 2).replace(/\\/g, ""));
    });
  };

  // Handle input changes
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onSaveResult = useCallback(() => {
    setLoading(true);
    saveGeneratedSteps({
      num1: formValues.firstNumber,
      num2: formValues.secondNumber,
      steps: stepsResult,
    }).then((result) => {
      setLoading(false);
      setShowAlert(true)
    }).catch(err => {
      setLoading(false);
      setError(true)
    });
  }, [stepsResult]);

  return (
    <main>
       {showAlert && (
        <div className="alert-container flex justify-end mr-[10px]">
          <div className="bg-green-100 border border-green-400 text-white-700 px-4 py-3 rounded-md my-2 w-[320px]">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline">  Steps saved to DB.</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3 mt-[8px]">
              <svg
                className="fill-current h-6 w-6 text-red-500 cursor-pointer"
                role="button"
                onClick={handleCloseAlert}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path
                  fillRule="evenodd"
                  d="M14.95 14.95a1 1 0 01-1.414 0L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464a1 1 0 011.414-1.414L10 8.586l3.536-3.536a1 1 0 011.414 1.414L11.414 10l3.536 3.536a1 1 0 010 1.414z"
                  clipRule="evenodd"
                  fill="green"
                ></path>
              </svg>
            </span>
          </div>
        </div>
      )}
      {hasError && (
       <div className="alert-container flex justify-end mr-[10px]">
         <div className="bg-red-100 border border-red-400 text-white-700 px-4 py-3 rounded-md my-2 w-[320px]">
           <strong className="font-bold">Error!</strong>
           <span className="block sm:inline"> Invalid steps data.</span>
           <span className="absolute top-0 bottom-0 right-0 px-4 py-3 mt-[8px]">
             <svg
               className="fill-current h-6 w-6 text-red-500 cursor-pointer"
               role="button"
               onClick={handleCloseAlert}
               xmlns="http://www.w3.org/2000/svg"
               viewBox="0 0 20 20"
             >
               <title>Close</title>
               <path
                 fillRule="evenodd"
                 d="M14.95 14.95a1 1 0 01-1.414 0L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464a1 1 0 011.414-1.414L10 8.586l3.536-3.536a1 1 0 011.414 1.414L11.414 10l3.536 3.536a1 1 0 010 1.414z"
                 clipRule="evenodd"
                 fill="red"
               ></path>
             </svg>
           </span>
         </div>
       </div>
     )}
      <form
        onSubmit={handleSubmit}
        className="max-w-[600px] mx-auto mt-[100px]"
      >
        <div className="mb-4 flex gap-[10px] items-center">
          <label
            htmlFor="firstNumber"
            className="block text-gray-700 font-bold mb-2 whitespace-nowrap"
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
            className="w-full rounded-md border p-2 text-right bg-gray-100"
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
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded justify-center flex w-[180px]"
            onClick={onSaveResult}
          >
            {isLoading ? "Saving to DB ..." : "Save results to DB"}
          </button>
        </div>
      </form>
    </main>
  );
}
