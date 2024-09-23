import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'
import { validatorRequire } from '../../shared/util/validators'
import { useFrom } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'

import './NewPost.css'

const NewPost = () => {

    const auth = useContext(AuthContext)

    const { sendRequest } = useHttpClient()

    const [formState, inputHandler] = useFrom({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)

    const history = useHistory()

    const postSubmitHandler = async event => {
        event.preventDefault()
        
        try {

            const formData = new FormData()

            formData.append('title', formState.inputs.title.value)
            formData.append('description', formState.inputs.description.value)
            formData.append('creator', auth.userId)
            formData.append('image', formState.inputs.image.value)

            await sendRequest(
                'http://localhost:5000/api/posts',
                'POST',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )

            history.push('/')

        } catch (err) {}
    }

    return(
        <div className="center main post">
            <form onSubmit={postSubmitHandler}>
                <Input 
                    id="title"
                    element="input"
                    type="text"
                    placeholder="عنوان"
                    errorText="لطفا عنوان معتبر وارد کنید."
                    validators={[validatorRequire()]}
                    onInput={inputHandler}
                />
                <Input 
                    id="description"
                    element="textarea"
                    placeholder="توضیح"
                    errorText="لطفا توضیح معتبر وارد کنید."
                    validators={[validatorRequire()]}
                    onInput={inputHandler}
                />
                <ImageUpload 
                    id="image"
                    onInput={inputHandler}
                    errorText="لطفا یک تصویر انتخاب کنید"
                />
                <Button
                    type="submit"
                    disabled={!formState.isValid}
                >
                    افزودن
                </Button>
            </form>
        </div>
    )
}

export default NewPost