'use client'

import React from 'react';
import Input from "@/app/account/Input";
import {FieldValues, useForm} from "react-hook-form";
import {Button} from "flowbite-react";
import toast from "react-hot-toast";
import {register} from "@/app/actions/userActions";
import {useRouter} from "next/navigation";
import Link from "next/link";

function RegisterForm() {

    const router = useRouter();

    const {
        control, handleSubmit, reset,
        formState: {isSubmitting, isValid}
    } = useForm({
        mode: 'onTouched'
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            const res = await register(data);
            if (res.error) {
                throw res.error
            }

            router.push('/account/login');
            toast.success(`Successfully registered, please login`);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            reset({email: '', password: '', firstName: data.firstName, lastName: data.lastName});
            toast.error(`${error.status} ${error.message}`);
        }
    }

    return (
        <div className="">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Register</h2>
            <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Input
                    label="Email"
                    name="email"
                    control={control}
                    type="email"
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                            message: 'Please enter a valid email address'
                        }
                    }}
                />
                <Input
                    label="First Name"
                    name="firstName"
                    control={control}
                    rules={{required: 'First name is required'}}
                />
                <Input
                    label="Last Name"
                    name="lastName"
                    control={control}
                    rules={{required: 'Last name is required'}}
                />
                <Input
                    label="Password"
                    name="password"
                    control={control}
                    type="password"
                    rules={{required: 'Password is required'}}
                />
                <div className="flex justify-center">
                    <Button
                        isProcessing={isSubmitting}
                        disabled={!isValid}
                        type="submit"
                        className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl
                        focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium
                        rounded-xl px-10 py-1 text-center  my-2"

                    >
                        <span className={'text-lg'}>Register</span>
                    </Button>
                </div>
            </form>
            <div className={`flex justify-center mt-2`}>
                <span className={`text-sm`}>Already have an account? <Link href="/account/login"
                                                                           className={`text-blue-500`}>Login</Link></span>
            </div>
        </div>
    );

}

export default RegisterForm;