import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { Skeleton } from "./skeleton";
import toast from "react-hot-toast";

const SelectDistrictAndUpazila = ({
  labelDistrict,
  className,
  withoutLabel,
  labelUpazila,
  placeHolderDistrict,
  placeHolderUpazila,
  defaultDistrict,
  defaultUpazila,
  setData,
}) => {
  const [allDistricts, setAllDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    defaultDistrict ? { value: defaultDistrict, label: defaultDistrict } : null
  );
  const [selectedUpazila, setSelectedUpazila] = useState(
    defaultUpazila ? { value: defaultUpazila, label: defaultUpazila } : null
  );
  const [filteredUpazilas, setFilteredUpazilas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtRes, upazilaRes] = await Promise.all([
          axios.get("/district.json"),
          axios.get("/upazilas.json"),
        ]);
        setAllDistricts(districtRes.data);
        setAllUpazilas(upazilaRes.data);
      } catch (error) {
        toast.error("Faild to fetch district and upazila data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      const filtered = allUpazilas.filter(
        (up) => up.district_name === selectedDistrict.value
      );
      setFilteredUpazilas(filtered);
    } else {
      setFilteredUpazilas([]);
    }
  }, [selectedDistrict, allUpazilas]);

  const handleDistrictChange = (selectedOption) => {
    setSelectedDistrict(selectedOption);
    setSelectedUpazila(null);
    setData({ district: selectedOption, upazila: defaultUpazila });
  };

  const handleUpazilaChange = (selectedOption) => {
    setSelectedUpazila(selectedOption);
    setData({ district: selectedDistrict, upazila: selectedOption });
  };

  const districtOptions = allDistricts.map((district) => ({
    value: district.name,
    label: district.name,
  }));

  const upazilaOptions = filteredUpazilas.map((upazila) => ({
    value: upazila.name,
    label: upazila.name,
  }));

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      border: "1px solid #e5e7eb",
      borderColor: state.isFocused ? "transparent" : "#d1d5db",
      borderRadius: "0.375rem",
      padding: "2px 5px",
      fontSize: "0.875rem",
      boxShadow: state.isFocused ? "0 0 0 1px rgba(185, 28, 28, 0.6)" : "none",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? "transparent" : "#d1d5db",
      },
      backgroundColor: state.isDisabled ? "#f9fafb" : "#ffffff",
      minHeight: "40px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(55, 65, 81, 0.8)",
      fontWeight: "500",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#374151",
    }),
    menu: (provided) => ({
      ...provided,
      marginTop: "4px",
      borderRadius: "15px",
      backgroundColor: "#ffffff",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: "200px",
      overflowY: "auto",
      borderRadius: "0.375rem",
      padding: "0",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px 15px",
      fontSize: "14px",
      backgroundColor: state.isFocused ? "rgba(59, 130, 246, 0.1)" : "#ffffff",
      color: state.isFocused ? "#1d4ed8" : "#111827",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "rgba(59, 130, 246, 0.2)",
      },
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: "#9ca3af",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#1d4ed8",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#1d4ed8",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        color: "#1e40af",
      },
    }),
  };

  return (
    <>
      <div className={`w-full mb-4 relative ${className}`}>
        {!withoutLabel && (
          <>
            <label className="block mb-1 font-semibold text-neutral-800">
              {labelDistrict || "Select a district"}
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
          </>
        )}
        {!allDistricts || !allUpazilas ? (
          <Skeleton className={`w-full h-[42px]`} />
        ) : (
          <Select
            className="!w-full"
            options={districtOptions}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            isSearchable={true}
            placeholder={placeHolderDistrict || "Choose a district"}
            styles={customStyles}
          />
        )}
      </div>
      <div className="w-full">
        {!withoutLabel && (
          <>
            <label className="block mb-1 font-semibold text-neutral-800">
              {labelUpazila || "Select an upazila"}
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
          </>
        )}
        {!allDistricts || !allUpazilas ? (
          <Skeleton className={`w-full h-[42px]`} />
        ) : (
          <Select
            className="!w-full"
            options={upazilaOptions}
            value={selectedUpazila}
            onChange={handleUpazilaChange}
            isSearchable={true}
            placeholder={
              placeHolderUpazila ||
              `${
                !selectedDistrict ? "Chose district first" : "Choose an upazila"
              }`
            }
            styles={customStyles}
            isDisabled={!selectedDistrict}
          />
        )}
      </div>
    </>
  );
};

export default SelectDistrictAndUpazila;
