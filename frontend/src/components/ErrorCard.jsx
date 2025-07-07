import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ErrorCard = ({ title, message }) => (
  <div className="min-h-screen bg-primary text-text-primary flex items-center justify-center">
    <div className="max-w-md bg-secondary border border-red-300 shadow-lg rounded-lg p-8 text-center flex flex-col items-center">
      <div className="mb-4">
        <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-red-600 mb-2">{title}</h2>
      <p className="text-text-secondary mb-2">{message}</p>
      <p className="text-sm text-red-600">
        Bitte leite diese Fehlermeldung an die Studienleitung weiter.
      </p>
    </div>
  </div>
);

export default ErrorCard;
