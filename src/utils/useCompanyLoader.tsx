import axios, { Canceler } from "axios";
import { useEffect, useState } from "react";
import { CompanyInfo } from "./LoadProps";

type useCompanyLoaderProps = {
  pageNumber: number;
};

const useCompanyLoader = ({ pageNumber }: useCompanyLoaderProps) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [companyList, setCompanyList] = useState<CompanyInfo[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [roleList, setRoleList] = useState<string[]>([]);
  const [locationList, setLocationList] = useState<string[]>([]);

  // assuming limit to fetch record in one go is 100.
  const LIMIT = 15;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(false);

      let cancel: Canceler = () => {};
      try {
        const response = await axios.post(
          "https://api.weekday.technology/adhoc/getSampleJdJSON",
          { limit: LIMIT, offset: pageNumber },
          {
            cancelToken: new axios.CancelToken((c) => {
              cancel = c;
            }),
          }
        );

        setHasMore(response.data.jdList.length > 0);
        setCompanyList((prevCompanyList) => [
          ...prevCompanyList,
          ...response.data.jdList,
        ]);

        setRoleList((prevRole) => [
          ...new Set([
            ...prevRole,
            ...response.data.jdList.map((item: CompanyInfo) => item.jobRole),
          ]),
        ]);
        setLocationList((prevLocation) => [
          ...new Set([
            ...prevLocation,
            ...response.data.jdList.map((item: CompanyInfo) => item.location),
          ]),
        ]);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        setError(true);
        setLoading(false);
      }
    };

    const source = axios.CancelToken.source();

    fetchData();

    return () => {
      source.cancel();
    };
  }, [pageNumber]);

  return {
    isLoading,
    error,
    companyList,
    hasMore,
    roleList,
    locationList,
  };
};

export default useCompanyLoader;
