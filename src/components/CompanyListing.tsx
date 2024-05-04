import { useEffect, useState } from "react";
import { CompanyInfo } from "../utils/LoadProps";
import useCompanyLoader from "../utils/useCompanyLoader";

const CompanyListing = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const minBasePay = [...Array(10).keys()].map((num) => num * 10);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [basePay, setBasePay] = useState<number>(0);
  const [companyName, setCompanyName] = useState<string | null>(null);

  const { isLoading, error, companyList, hasMore, roleList, locationList } =
    useCompanyLoader({
      pageNumber: pageNumber,
    });
  const [renderCompanyList, setRenderCompanyList] = useState<CompanyInfo[]>([]);

  useEffect(() => {
    setPageNumber(1);
  }, []);

  useEffect(() => {
    setRenderCompanyList(companyList);
  }, [companyList]);

  const handleFilter = () => {
    let filteredCompanyList = companyList.filter((company) => {
      if (
        companyName !== null &&
        companyName != "" &&
        company.companyName !== companyName
      ) {
        return false;
      }
      if (
        selectedRole !== null &&
        selectedRole != "" &&
        company.jobRole !== selectedRole
      ) {
        return false;
      }
      if (
        location !== null &&
        location != "" &&
        company.location !== location
      ) {
        return false;
      }
      if (basePay != NaN && company.minJdSalary <= basePay) {
        return false;
      }
      return true;
    });
    console.log(basePay);
    setRenderCompanyList(filteredCompanyList);
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight * 0.9 && hasMore) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, renderCompanyList]);

  return (
    <>
      <div className="pt-10">
        <div className="flex justify-center flex-row sm:gap-8 gap-4">
          <select
            value={selectedRole ? selectedRole : ""}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-30 h-10 p-2 border border-gray-500 rounded-xl"
          >
            <option value="">Select Role</option>
            {roleList.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={location ? location : ""}
            onChange={(e) => setLocation(e.target.value)}
            className="w-30 h-10 p-2 border border-gray-500 rounded-xl"
          >
            <option value="">Select Location</option>
            {locationList.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <select
            value={basePay ? basePay : ""}
            onChange={(e) => setBasePay(parseInt(e.target.value))}
            className="w-30 h-10 p-2 border border-gray-500 rounded-xl"
          >
            <option value="">Select Min Pay</option>
            {minBasePay.map((option, index) => (
              <option key={index} value={option}>
                {option} + LPA
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Enter Company"
            value={companyName ? companyName : ""}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-30 h-10 p-2 border border-gray-500 rounded-xl"
          />
          <button onClick={handleFilter}>Filter</button>
        </div>
      </div>
      <br />
      <div className="max-w-[90rem] mx-auto px-8 w-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-10">
        {renderCompanyList.map((company, index) => (
          <div
            key={index}
            className="rounded-2xl h-full w-full p-4 overflow-hidden"
          >
            <Card company={company} />
          </div>
        ))}
        {isLoading && <div>Loading...</div>}
        {error && <div>Error</div>}
      </div>
    </>
  );
};

const Card = ({ company }: { company: CompanyInfo }) => {
  return (
    <div className="max-w-xl mx-auto p-5 white border border-gray-300 rounded-2xl transform hover:scale-105 transition-transform">
      <div className="rounded-2xl">
        <div className="flex flex-row gap-1 max-h-16 p-1">
          <div className="my-auto px-2">
            <img src={company.logoUrl} className="w-12 h-12" />
          </div>
          <div className="flex-col px-2">
            <h3 className="font-bold leading-5 text-[1rem] text-slate-400">
              {company.companyName}
            </h3>
            <h4 className="leading-5 text-[0.9rem] font-thin">
              {company.jobRole.toUpperCase()}
            </h4>
            <h5 className="leading-5 text-[0.9rem]">
              {company.location} | {company.minExp}-{company.maxExp} years
            </h5>
          </div>
        </div>
        <div className="text-slate-500 pt-2">
          Estimated Salary: ${company.minJdSalary} - ${company.maxJdSalary} ✅
        </div>
      </div>
      <div className="pt-2">
        <h2 className="font-bold text-[1.3rem]">About Company</h2>
        <h4 className="text-[1rem]">About Us</h4>
        <div className="font-[0.7rem] pt-2 flex flex-wrap items-center justify-center font-serif leading-5">
          <p>
            <span className="text-black text-opacity-90">
              {company.jobDetailsFromCompany.substring(0, 100)}
            </span>
            <span className="text-black text-opacity-75">
              {company.jobDetailsFromCompany.substring(100, 150)}
            </span>
            <span className="text-black text-opacity-60">
              {company.jobDetailsFromCompany.substring(150, 200)}
            </span>
            <span className="text-black text-opacity-40">
              {company.jobDetailsFromCompany.substring(200, 250)}
            </span>
            <span className="text-black text-opacity-40">
              {company.jobDetailsFromCompany.substring(250, 300)}
            </span>
          </p>
          <button className="px-auto text-blue-400">View Job</button>
        </div>
      </div>
      <div>
        <h2 className="font-semibold">Minimum Experience</h2>
        <p>{company.minExp} years</p>
        <div className="flex justify-center pt-2">
          <button className="w-full font-semibold py-2 rounded-xl bg-[#55efc4]">
            ⚡ Easy Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyListing;
