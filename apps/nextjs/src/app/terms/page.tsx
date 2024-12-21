import { Separator } from "~/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="space-y-4 container mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <Separator />
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using QuickPull, a service provided by Zed Softworks
          LLC, you agree to be bound by these Terms and Conditions. If you
          disagree with any part of the terms, you may not use our service.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">
          2. Description of Service
        </h2>
        <p>
          QuickPull provides a bulk image and video downloading service. We
          allow users to download collections of images and videos efficiently.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
        <p>You are responsible for:</p>
        <ul className="list-disc list-inside ml-4">
          <li>
            Ensuring you have the right to download and use any content accessed
            through our service
          </li>
          <li>
            Complying with all applicable laws and regulations in your use of
            QuickPull
          </li>
          <li>Maintaining the confidentiality of your account information</li>
        </ul>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
        <p>
          QuickPull and its original content, features, and functionality are
          owned by Zed Softworks LLC and are protected by international
          copyright, trademark, patent, trade secret, and other intellectual
          property or proprietary rights laws.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">
          5. Limitation of Liability
        </h2>
        <p>
          In no event shall QuickPull, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the service.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">6. Data Collection</h2>
        <p>
          We collect anonymous telemetry data using PostHog to understand how
          our service is used. This data collection is solely for the purpose of
          improving our service. For more information, please refer to our
          Privacy Policy.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
        <p>
          We may terminate or suspend your access to our service immediately,
          without prior notice or liability, for any reason whatsoever,
          including without limitation if you breach the Terms.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. If
          a revision is material, we will try to provide at least 30 days&apos;
          notice prior to any new terms taking effect.
        </p>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:{" "}
          <a
            href="mailto:support@zedsoftworks.dev"
            className="text-blue-600 hover:underline"
          >
            support@zedsoftworks.dev
          </a>
        </p>
      </section>
    </div>
  );
}
