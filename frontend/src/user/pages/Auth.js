import React, { useState, useContext } from 'react'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import { validatorRequire } from '../../shared/util/validators'
import { useFrom } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './Auth.css'

const Auth = () => {
    const auth = useContext(AuthContext)

    const [isLoginMode, setIsLoginMode] = useState(true)

    const { sendRequest } = useHttpClient()

    const [formState, inputHandler, setFormData] = useFrom({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)
    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            },
                formState.inputs.email.isValid &&
                formState.inputs.password.isValid
            )
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode)
    }
    const authSubmitHandler = async event => {
        event.preventDefault()

        console.log(formState.inputs)
        
        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                )

                auth.login(responseData.userId, responseData.token)

            } catch (err) {
                console.log(err)
            }
        } else {
            try {

                const formData = new FormData()

                formData.append('name', formState.inputs.name.value)
                formData.append('email', formState.inputs.email.value)
                formData.append('password', formState.inputs.password.value)
                formData.append('image', formState.inputs.image.value)

                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/singup',
                    'POST',
                    formData
                )

                auth.login(responseData.userId, responseData.token)

            } catch (err) {
                console.log(err)
            }
        }
    }
    return (
        <div className="center main auth">
            <h2>ورود و ثبت نام</h2>
            <form onSubmit={authSubmitHandler}>
                {!isLoginMode &&
                    <Input 
                        id="name"
                        type="text"
                        element="input"
                        placeholder="نام"
                        validators={[validatorRequire()]}
                        errorText="لطفا نام معتبر وارد کنید."
                        onInput={inputHandler}
                    />
                }
                {!isLoginMode &&
                    <ImageUpload 
                        id="image"
                        onInput={inputHandler}
                    />
                }
                <Input 
                    id="email"
                    type="email"
                    element="input"
                    placeholder="ایمیل"
                    validators={[validatorRequire()]}
                    errorText="لطفا ایمیل معتبر وارد کنید."
                    onInput={inputHandler}
                />
                <Input 
                    id="password"
                    type="password"
                    element="input"
                    placeholder="رمز عبور"
                    validators={[validatorRequire()]}
                    errorText="لطفا رمز عبور معتبر وارد کنید."
                    onInput={inputHandler}
                />
                <Button
                    type="submit"
                    disabled={!formState.isValid}
                >
                    {isLoginMode ? 'ورورد' : 'ثبت نام'}
                </Button>
            </form>
            <Button
                onClick={switchModeHandler}
            >
                تغییر به {isLoginMode ? 'ثبت نام' : 'ورود'}
            </Button>
        </div>
    )
}

export default Auth