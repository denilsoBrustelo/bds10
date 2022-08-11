import { AxiosRequestConfig } from "axios";
import Pagination from 'components/Pagination';
import EmployeeCard from 'components/EmployeeCard';
import { useCallback, useEffect, useState } from "react";
import { SpringPage } from "types/vendor/spring";
import { Link } from 'react-router-dom';
import { Employee } from 'types/employee';
import { requestBackend } from "util/requests";
import { hasAnyRoles } from "util/auth";

import './styles.css';

type ControlComponentsData = {
  activePage: number;
}

const List = () => {

  const [page, setPage] = useState<SpringPage<Employee>>();

  const [ controlComponentsData, setControlComponentsData] = useState<ControlComponentsData>( 
    {
      activePage: 0
    }  
  );

  const handlePageChange = (pageNumber: number) => {
    
    setControlComponentsData({activePage: pageNumber });
  };

  const getEmployees = useCallback(() => {

    const config : AxiosRequestConfig = { 
      method: 'GET',
      url: "/employees",
      withCredentials: true,
      params: {
        page: controlComponentsData.activePage,
        size: 3
      }
    };

    requestBackend(config).then((response) => {
      setPage(response.data);
    });

  }, [controlComponentsData]);


  useEffect( () => {
    getEmployees();
  }, [getEmployees])

  return (
    <>
      <Link to="/admin/employees/create">

      { hasAnyRoles(['ROLE_ADMIN']) && (
          <button className="btn btn-primary text-white btn-crud-add">
          ADICIONAR
        </button>

      )}

      </Link>


      <div className="row">
        {  page?.content.map( employee => (
            <div className="col-sm-6 col-md-12" key={employee.id} >
              <EmployeeCard employee={employee} />
            </div>   
        )) }
      </div>

      <Pagination
        forcePage={page?.number}
        pageCount={(page) ? page.totalPages : 0} 
        range={3}
        onChange={handlePageChange}
      />
    </>
  );
};

export default List;
