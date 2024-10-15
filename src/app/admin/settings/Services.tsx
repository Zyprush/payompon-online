import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase";

const Services = () => {
  const [services, setServices] = useState<
    {
      name: string;
      price: string;
    }[]
  >([]);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));
      if (servicesDoc.exists()) {
        setServices(servicesDoc.data().services || []);
      }
    };
    fetchServices();
  }, []);

  const saveServices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null);
    setLoading(true);
    await setDoc(doc(db, "settings", "services"), { services });
    setLoading(false);
    setIsEditing(false);
  };

  const isFormValid = () => {
    return services.every(
      (service) => service.name.trim() !== "" && service.price.trim() !== ""
    );
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setServices((prevServices) =>
      prevServices.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const deleteService = (index: number) =>
    setServices(services.filter((_, i) => i !== index));

  const addService = () =>
    setServices([
      ...services,
      {
        name: "",
        price: "",
      },
    ]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="bg-white p-5 rounded-lg border flex flex-col gap-3 text-zinc-600">
      <div className="flex justify-between items-center">
        <span className="font-bold text-primary">Services</span>
        <button
          onClick={toggleEdit}
          className="btn btn-sm text-primary btn-outline rounded-sm"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {services.length > 0 && (
        <table className="table-auto w-full">
          <thead>
            <tr className="border-b-2 text-primary">
              <th className="text-left p-2">Service Name</th>
              <th className="text-left p-2">Price</th>
              {isEditing && <th className="text-left p-2">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={index} className="border-b">
                <td className="p-2 text-sm">
                  {isEditing ? (
                    <input
                      type="text"
                      placeholder="Service Name"
                      value={service.name}
                      onChange={(e) =>
                        handleServiceChange(index, "name", e.target.value)
                      }
                      className="p-2 text-sm border-primary border-2 rounded-sm w-full"
                    />
                  ) : (
                    service.name
                  )}
                </td>
                <td className="p-2">
                  {isEditing ? (
                    <input
                      type="number"
                      placeholder="Price"
                      value={service.price}
                      onChange={(e) =>
                        handleServiceChange(index, "price", e.target.value)
                      }
                      className="p-2 text-sm border-primary border-2 rounded-sm w-full"
                    />
                  ) : (
                    service.price
                  )}
                </td>
                {isEditing && (
                  <td className="p-2">
                    <button
                      onClick={() => deleteService(index)}
                      className="btn btn-sm rounded-sm text-white btn-error"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isEditing && (
        <div className="mt-5 flex gap-5 justify-end">
          <button
            onClick={addService}
            className="btn btn-sm text-primary btn-outline"
          >
            Add Service
          </button>
          <button
            onClick={saveServices}
            className="btn btn-sm btn-primary text-white"
            disabled={!isFormValid() || loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
