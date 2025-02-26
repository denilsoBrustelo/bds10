

import { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useHistory  } from "react-router-dom";
import Select from "react-select";
import { toast } from 'react-toastify';
import { requestBackend } from "util/requests";
import { Department } from "types/department";
import { Employee } from "types/employee";
import './styles.css';

const Form = () => {


  const history = useHistory();

  const [ selectDepartamentos, setSelectDepartamentos ] = useState<Department[]>([]);

  const { register, 
    handleSubmit, 
    formState: {errors},
    control
  } = useForm<Employee>();

  useEffect( () => {
    requestBackend({url:'/departments', withCredentials: true})
    .then( response => {
      setSelectDepartamentos(response.data);
    })

}, [] )    

    const onSubmit = ( formData : Employee) => {

      const config : AxiosRequestConfig =  { 
          method: 'POST',
          url: '/employees',
          data: formData, 
          withCredentials: true
       }

      requestBackend(config)
      .then(() => {
         toast.info('Cadastrado com sucesso');
         history.push("/admin/employees");
      })
      .catch( () => {
          toast.error("Erro ao cadastrar");
         }
      );
   };

  const handleCancel = () => {
    history.push("/admin/employees");
  };

  return (
    <div className="employee-crud-container">
      <div className="base-card employee-crud-form-card">
        <h1 className="employee-crud-form-title">INFORME OS DADOS</h1>

        <form onSubmit={handleSubmit(onSubmit)} data-testid="form">
          <div className="row employee-crud-inputs-container">
            <div className="col employee-crud-inputs-left-container">

              <div className="margin-bottom-30">

              <input
                     {...register('name', {
                                required: 'Campo obrigatório'
                                     })} 
                                type="text"
                                className={`form-control base-input ${ errors.name ? 'is-invalid' : '' }`}
                                placeholder="Nome "
                                name="name"
                                data-testid="name"
                                />                
                <div className="invalid-feedback d-block">{errors.name?.message}</div>
              </div>


              <div className="margin-bottom-30">

                <input
                      {...register('email', {
                                  required: 'Campo obrigatório',
                                  pattern: { 
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                     message: "Email inválido"
                                   }
                                  })} 

                                  type="text"
                                  className={`form-control base-input ${ errors.name ? 'is-invalid' : '' }`}
                                  placeholder="email "
                                  name="email"
                                  data-testid="email"
                                  />                
                  <div className="invalid-feedback d-block">{errors.email?.message}</div>
             </div>

              <div className="margin-bottom-30">

                    <label htmlFor="Departamento" className="d-none">Departamento</label>
                         <Controller 
                               name="department"
                               rules={{required: true}}
                               control={control}
                                render={ ({field}) => (
                                        <Select  {...field}
                                        options={selectDepartamentos} 
                                        classNamePrefix="product-crud-select"
                                        getOptionLabel={(department: Department) => department.name }
                                        getOptionValue={(department: Department) => String(department.id) }
                                        inputId="Departamento"
                                     />
                                    )  
                                   }
                           />
                           { errors.department && ( 
                                 <div className="invalid-feedback d-block">Campo obrigatório</div>
                               ) 
                           }              
                 </div>

            </div>
          </div>
          <div className="employee-crud-buttons-container">
            <button
              className="btn btn-outline-danger employee-crud-button"
              onClick={handleCancel}
            >
              CANCELAR
            </button>
            <button className="btn btn-primary employee-crud-button text-white">
              SALVAR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;
