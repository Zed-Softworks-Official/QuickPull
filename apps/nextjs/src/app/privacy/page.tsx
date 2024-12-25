import { Separator } from '@quickpull/ui/components/separator'

export default function PrivacyPage() {
    return (
        <div className="container mx-auto flex max-w-xl flex-col gap-4">
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <Separator />
            <div className="space-y-4">
                <section>
                    <h2 className="mb-2 text-xl font-semibold">1. Introduction</h2>
                    <p>
                        This Privacy Policy explains how QuickPull, a service provided by
                        Zed Softworks LLC (&quot;we&quot;, &quot;us&quot;, or
                        &quot;our&quot;), collects, uses, and protects your information
                        when you use our bulk image and video downloading service.
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">
                        2. Information We Collect
                    </h2>
                    <p>
                        We do not collect any personal information from our users. The
                        only data we collect is anonymous telemetry data using PostHog to
                        help us understand how people use our service.
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">
                        3. How We Use Your Information
                    </h2>
                    <p>
                        The telemetry data we collect is used solely for the purpose of
                        improving our service. This data helps us understand:
                    </p>
                    <ul className="ml-4 list-inside list-disc">
                        <li>How frequently our service is used</li>
                        <li>Which features are most popular</li>
                        <li>Any errors or issues that users may encounter</li>
                    </ul>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">4. Data Protection</h2>
                    <p>
                        We are committed to ensuring that your information is secure. We
                        have implemented suitable physical, electronic, and managerial
                        procedures to safeguard and secure the information we collect
                        online.
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">5. Your Rights</h2>
                    <p>
                        As we do not collect any personal information, there is no
                        personally identifiable data for you to access, correct, or
                        delete. The telemetry data we collect is completely anonymous.
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">
                        6. Changes to This Privacy Policy
                    </h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify
                        you of any changes by posting the new Privacy Policy on this page.
                        You are advised to review this Privacy Policy periodically for any
                        changes.
                    </p>
                </section>
                <section>
                    <h2 className="mb-2 text-xl font-semibold">7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please
                        contact us at:{' '}
                        <a
                            href="mailto:support@zedsoftworks.dev"
                            className="text-blue-600 hover:underline"
                        >
                            support@zedsoftworks.dev
                        </a>
                    </p>
                </section>
            </div>
        </div>
    )
}
