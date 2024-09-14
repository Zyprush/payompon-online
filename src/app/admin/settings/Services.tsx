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
  const [loading, setLoading] = useState(false); // New loading state

  // Fetch services from Firestore on component mount
  useEffect(() => {
    const fetchServices = async () => {
      const servicesDoc = await getDoc(doc(db, "settings", "services"));
      if (servicesDoc.exists()) {
        setServices(servicesDoc.data().services || []);
      }
    };
    fetchServices();
  }, []);

  // Save services to Firestore
  const saveServices = async () => {
    if (!isFormValid()) {
      setError("Please complete all fields.");
      return;
    }

    setError(null); // Clear error
    setLoading(true); // Set loading to true
    await setDoc(doc(db, "settings", "services"), { services });
    setLoading(false); // Set loading to false after saving
    setIsEditing(false); // Exit editing mode after saving
  };

  const isFormValid = () => {
    return services.every(service => service.name.trim() !== "" && service.price.trim() !== "");
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

      {services.length > 0 &&
        services.map((service, index) => (
          <div key={index} className="flex gap-3">
            {isEditing ? (
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  placeholder="Service Name"
                  value={service.name}
                  onChange={(e) =>
                    handleServiceChange(index, "name", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm w-80"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={service.price}
                  onChange={(e) =>
                    handleServiceChange(index, "price", e.target.value)
                  }
                  className="p-2 text-sm border-primary border-2 rounded-sm"
                />
                <button
                  onClick={() => deleteService(index)}
                  className="btn btn-sm rounded-sm text-white btn-error"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <span>{service.name}</span>
                <span>{service.price}</span>
              </div>
            )}
          </div>
        ))}

      {isEditing && (
        <div className="mx-auto flex gap-5">
          <button
            onClick={addService}
            className="btn btn-sm text-primary btn-outline"
          >
            Add Service
          </button>
          <button
            onClick={saveServices}
            className="btn btn-sm btn-primary text-white"
            disabled={!isFormValid() || loading} // Disable button if form is invalid or loading
          >
            {loading ? "Saving..." : "Save Changes"} {/* Show loading text */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Services;
