'use client'

import React from 'react';
import Input from "@/app/account/Input";
import {FieldValues, useForm} from "react-hook-form";
import {Button} from "flowbite-react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {login} from "@/app/actions/userActions";
import {useUserStore} from "@/hooks/useUserStore";
import { redirect } from "next/navigation";


function LoginForm() {
    const router = useRouter();
    const user = useUserStore(state => state.user);

    const {
        control, handleSubmit, reset,
        formState: {isSubmitting, isValid}
    } = useForm({
        mode: 'onTouched'
    })

    const onSubmit = async (data: FieldValues) => {
        try {
            const res = await login(data);
            if (res.error) {
                throw res.error;
            }

            toast.success(`Successfully logged in`);
            router.push('/');
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            reset({password: '', email: data.email});
            toast.error(`${error.message}`);
        }
    }

    if(user)
        redirect('/');

    return (
        <div className="">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Login</h2>
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
                    label="Password"
                    name="password"
                    control={control}
                    type="password"
                    rules={{required: 'Password is required'}}
                />
                <div className="flex justify-center">
                    <Button
                        disabled={!isValid || isSubmitting}
                        type="submit"
                        className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl
                        focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium
                        rounded-xl px-10 py-1 text-center  my-2"

                    >
                        {isSubmitting ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <span className="text-lg">Login</span>
                        )}
                    </Button>
                </div>
            </form>
            <div className={`flex justify-center mt-2`}>
                <span className={`text-sm`}>Don&apos;t have an account? <Link href="/account/register"
                                                                         className={`text-blue-500`}>Register</Link></span>
            </div>
        </div>
    );

}

export default LoginForm;