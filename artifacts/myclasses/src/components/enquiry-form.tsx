import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation } from "wouter";
import { useCreateEnquiry, getGetEnquiriesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().regex(/^[0-9]{10}$/, {
    message: "Please enter a valid 10-digit phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  boardClass: z.string().min(1, {
    message: "Please select a board and class.",
  }),
  subject: z.string().min(1, {
    message: "Please select a subject.",
  }),
  location: z.string().min(2, {
    message: "Please enter your location or area.",
  }),
  message: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof formSchema>;

export function EnquiryForm() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const createEnquiry = useCreateEnquiry();

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      boardClass: "",
      subject: "",
      location: "",
      message: "",
    },
  });

  function onSubmit(values: EnquiryFormValues) {
    createEnquiry.mutate(
      { data: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetEnquiriesQueryKey() });
          toast.success("Enquiry submitted successfully!");
          setLocation("/thank-you");
        },
        onError: () => {
          toast.error("Something went wrong. Please try again.");
        },
      }
    );
  }

  const isPending = createEnquiry.isPending;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-orange-500/5 border border-orange-100" data-testid="container-enquiry-form">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Register for a Free Demo Class</h2>
        <p className="text-gray-600 text-sm">Book your free demo class today! We will call you within 24 hours.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Student / Parent Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter full name" {...field} data-testid="input-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="10-digit number" {...field} data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="boardClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Board & Class *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-board">
                        <SelectValue placeholder="Select board & class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SSC-Class 8">SSC - Class 8</SelectItem>
                      <SelectItem value="SSC-Class 9">SSC - Class 9</SelectItem>
                      <SelectItem value="SSC-Class 10">SSC - Class 10</SelectItem>
                      <SelectItem value="CBSE-Class 6">CBSE - Class 6</SelectItem>
                      <SelectItem value="CBSE-Class 7">CBSE - Class 7</SelectItem>
                      <SelectItem value="CBSE-Class 8">CBSE - Class 8</SelectItem>
                      <SelectItem value="ICSE-Class 6">ICSE - Class 6</SelectItem>
                      <SelectItem value="ICSE-Class 7">ICSE - Class 7</SelectItem>
                      <SelectItem value="ICSE-Class 8">ICSE - Class 8</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-subject">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Maths">Maths</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="SST">SST</SelectItem>
                      <SelectItem value="AI">AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location / Area *</FormLabel>
                <FormControl>
                  <Input placeholder="E.g. Andheri West, Mumbai" {...field} data-testid="input-location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Any specific requirements? (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a bit about the student's needs..." 
                    className="resize-none" 
                    {...field} 
                    data-testid="input-message"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-medium bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            disabled={isPending}
            data-testid="button-submit"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              "Book Free Demo Class"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
