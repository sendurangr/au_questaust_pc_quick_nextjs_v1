"use client";
import * as React from "react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast"
import {LoaderCircleIcon, SendIcon} from "lucide-react";
import {useSearchParams} from 'next/navigation'

const formSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/),
    cardName: z.string().regex(/^[a-zA-Z\s]+$/),
    cardExpirationMonth: z.string({
        message: 'Invalid month, please enter a valid month between 01 and 12',
    }).regex(/^(0?[0-9]|1[0-2])$/),
    cardExpirationYear: z.string({
        message: 'Invalid year, please enter a valid year between 24 and 99',

    }).regex(/^[2-9][0-9]$/),
});

export default function Home({params}: { params: { personRef: string } }) {

    const {toast} = useToast()

    const searchParams = useSearchParams()

    const name = searchParams.get('name') ?? 'Guest';

    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cardNumber: "",
            cardName: "",
            cardExpirationMonth: '',
            cardExpirationYear: '',
        }
    });

    const onSubmitFormData = (data: z.infer<typeof formSchema>) => {
        setLoading(true);
        postCC(data);
    }

    const onReset = () => {
        form.reset();
        setSuccess(false)
    }

    const showSuccess = () => {
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 10000);
    }


    // post method to /api/pass-cc
    function postCC(data: z.infer<typeof formSchema>) {
        fetch('/ect/cc-det/api', {
            method: 'POST',
            body: JSON.stringify({
                refNumber: params.personRef,
                cardNumber: data.cardNumber,
                cardName: data.cardName,
                cardExpirationMonth: data.cardExpirationMonth,
                cardExpirationYear: data.cardExpirationYear,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(
            (response) => {
                console.log(response)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }
        ).then(
            (data) => {
                setLoading(false);
                toast({
                    title: 'Success',
                    description: 'Credit Card Information has been sent',
                    variant: "default",
                });
                form.reset();
                showSuccess();
            }
        ).catch(
            (error) => {
                setLoading(false);
                toast({
                    title: 'Error',
                    description: 'Failed to send Credit Card Information',
                    variant: "destructive",
                })
            }
        );
    }

    /*
    <button onClick={() => postCC()}
                        className={'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'}>
                    Send CC
                </button>
    * */

    return (
        <div className="h-screen flex md:items-center items-start bg-gray-50">
            <div className={"md:flex w-full md:justify-evenly"}>
                <div className={'flex align-middle'}>
                    <div className={'items-center self-center md:my-0 md:text-left text-center md:mx-0 my-10 mx-auto'}>

                        <h2 className="text-3xl font-semibold tracking-tight text-teal-800">
                            Entreprise Corporate Traveller
                        </h2>
                        <h4 className="text-lg mt-2">
                            Secured Credit Card Information Portal
                        </h4>

                        <hr className={'my-6'}/>

                        <h4 className="text-lg">
                            # Booking Reference: <span
                            className={'text-teal-800 font-semibold'}>{params.personRef}</span>
                        </h4>
                    </div>

                </div>
                <div>
                    <Card className="md:mx-2 mx-2">
                        <CardHeader>
                            <CardTitle>Card Details</CardTitle>
                            <CardDescription>Please enter your credit card details to secure your
                                bookings.</CardDescription>
                            <hr/>
                        </CardHeader>
                        <Form {...form}>
                            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmitFormData)}>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-y-8">
                                        <FormField
                                            control={form.control}
                                            name="cardName"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Name on Card</FormLabel>
                                                    <FormControl>
                                                        <Input type="text" placeholder="" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="cardNumber"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Card Number</FormLabel>
                                                    <FormControl>
                                                        <Input className="border" type="text"
                                                               placeholder="16 digit" {...field} />
                                                    </FormControl>
                                                    {/*<FormDescription>
                                                        16 digits card number
                                                    </FormDescription>*/}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div>
                                            <Label>Card Expiration (MM/YY)</Label>
                                            <div className={'grid grid-cols-2 gap-2'}>
                                                <FormField
                                                    control={form.control}
                                                    name="cardExpirationMonth"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="text"
                                                                       placeholder="Month Ex: 01" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="cardExpirationYear"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input type="text"
                                                                       placeholder="Year Ex: 24" {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                        </div>
                                    </div>

                                    {success && (
                                        <div
                                            className=" mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                                            role="alert">
                                            <strong className="font-bold block">Success!</strong>
                                            <span className="block sm:inline">Credit Card Information has been sent</span>
                                        </div>)
                                    }

                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" onClick={onReset}>Reset</Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading && (
                                            <>
                                                <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin"/>
                                                Please wait
                                            </>
                                        )}
                                        {!loading && (
                                            <>
                                                <SendIcon type="submit" className="mr-2 h-4 w-4"/> Submit
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </div>
            </div>
        </div>

    );
}
