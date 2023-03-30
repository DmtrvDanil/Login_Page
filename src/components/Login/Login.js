import React, {useContext, useEffect, useReducer, useState} from "react";

import Card from "../UI/Card/Card";
import styles from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/input/input";


const emailReducer = (prevState, action) => {
  switch (action.type) {
    case "USER_INPUT": {
        return {
          value: action.value,
          isValid: action.value.includes("@")
        }
    }
    case "BlUR": {
      return {
        value: prevState.value,
        isValid: true
      }
    }
    default:
      return prevState
  }
}

const passwordReducer = (prevState, action) => {
  switch (action.type) {
    case 'PASSWORD_INPUT': {
      return {
        value: action.value,
        isValid: action.value.length > 7
      }
    }
    case 'BLUR': {
      return {
        value: prevState.value,
        isValid: prevState.value.length > 7
      }
    }
    default:
      return prevState
  }
}



const Login = (props) => {
  const context = useContext(AuthContext);
  const [emailState, emailDispatch] = useReducer(emailReducer, {value: "", isValid: undefined});
  const [passwordState, passwordDispatch] = useReducer(passwordReducer, {value: "", isValid: undefined});

  const [formIsValid, setFormIsValid] = useState(false);


  const {isValid: emailValid} = emailState;
  const {isValid: passwordValid} = passwordState;

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(emailValid && passwordValid);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [emailValid, passwordValid]);


  const emailChangeHandler = (event) => {
    emailDispatch({type: 'USER_INPUT', value: event.target.value});
  };

  const passwordChangeHandler = (event) => {
    passwordDispatch({type: 'PASSWORD_INPUT', value: event.target.value});
  };

  const validateEmailHandler = () => {
    emailDispatch({type: "BlUR"});
  };

  const validatePasswordHandler = () => {
    passwordDispatch({type: 'BLUR'});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      context.onLogin(emailState.value, passwordState.value);
    }
  };
  return (
    <Card className={styles.login}>
      <form onSubmit={submitHandler}>
        <Input id='email' label='Email' type='email'
               isValid={emailValid} value={emailState.value}
                onChange={emailChangeHandler} onBlur={validateEmailHandler}/>
        <Input id='password' label='Password' type='password'
               isValid={passwordValid} value={passwordState.value}
               onChange={passwordChangeHandler} onBlur={validatePasswordHandler}/>
        <div className={styles.actions}>
            <Button type="submit" className={styles.btn}>
            Вход
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
