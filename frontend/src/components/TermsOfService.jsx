import React from 'react';
import { Link } from 'react-router-dom';
import LegalPageLayout from './LegalPageLayout';

export default function TermsOfService() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="June 22, 2026" testId="terms-page">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of the weROI Jamaica
        website at weroi.net and related online properties, and your engagement with our digital
        growth services. By using our website or entering into a project with us, you agree to
        these Terms.
      </p>

      <h2>1. About weROI</h2>
      <p>
        weROI Jamaica (&quot;weROI,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a digital growth agency providing
        strategy, design, development, marketing automation, AI workflow implementation, and
        related consulting services to businesses. Our principal place of business is Kingston,
        Jamaica.
      </p>

      <h2>2. Services</h2>
      <p>
        weROI delivers custom digital growth services that may include website and funnel
        development, conversion optimization, campaign strategy, analytics setup, automation
        systems, content support, and ongoing advisory work. Specific deliverables, timelines, fees,
        and scope are defined in a written proposal, statement of work, invoice, or other agreement
        accepted by both parties (&quot;Project Agreement&quot;). If there is a conflict between these
        Terms and a signed Project Agreement, the Project Agreement controls for that project.
      </p>

      <h2>3. No guarantee of results</h2>
      <p>
        Business outcomes depend on many factors outside our control, including market conditions,
        product-market fit, pricing, operations, ad platform policies, and your team&apos;s execution.
        While we apply professional skill and care, we do not guarantee specific revenue, lead
        volume, ranking positions, conversion rates, ROI figures, or other performance results. Any
        benchmarks, case studies, or examples on our website are illustrative and not promises of
        future performance.
      </p>

      <h2>4. Client responsibilities</h2>
      <p>You agree to:</p>
      <ul>
        <li>Provide accurate information needed for discovery, delivery, and reporting</li>
        <li>Grant timely access to accounts, assets, branding, and stakeholders as reasonably required</li>
        <li>Review deliverables and provide feedback within agreed timeframes</li>
        <li>Ensure you have rights to any materials you supply for use in your project</li>
        <li>Comply with applicable laws, platform terms, and advertising rules in your industry</li>
      </ul>
      <p>
        Delays caused by missing access, incomplete inputs, or late approvals may shift timelines
        and may incur additional fees if stated in your Project Agreement.
      </p>

      <h2>5. Fees and payment</h2>
      <p>
        Fees, deposits, billing cadence, accepted payment methods, and late-payment terms are set
        out in your Project Agreement or invoice. Unless otherwise stated, invoices are due upon
        receipt. We may pause work on overdue accounts after reasonable notice. You are responsible
        for applicable taxes, bank fees, and currency conversion costs unless expressly included in
        your quote.
      </p>

      <h2>6. Project changes and cancellations</h2>
      <p>
        Changes to agreed scope may require a change order and additional fees. Either party may
        terminate a project as provided in the Project Agreement. If no termination clause exists,
        either party may end the engagement on written notice. Upon termination, you remain
        responsible for fees for work performed and non-cancellable third-party costs incurred
        before the effective termination date.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        Unless your Project Agreement states otherwise, weROI retains ownership of pre-existing
        tools, frameworks, templates, methodologies, and know-how used across client engagements.
        Upon full payment of applicable fees, you receive the rights specified in your Project
        Agreement to final deliverables created specifically for you, such as custom designs, copy,
        and configured systems, excluding third-party materials and our underlying reusable
        components.
      </p>
      <p>
        You grant weROI a limited license to use your name, logo, and non-confidential project
        outcomes in our portfolio, website, and marketing unless you opt out in writing.
      </p>

      <h2>8. Confidentiality</h2>
      <p>
        Each party agrees to keep confidential non-public business information received from the
        other party, except where disclosure is required by law or information is already public
        through no fault of the receiving party. Confidentiality obligations survive project
        completion.
      </p>

      <h2>9. Website use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use our website for unlawful, misleading, or harmful purposes</li>
        <li>Attempt to gain unauthorized access to our systems or data</li>
        <li>Interfere with site security, performance, or other users&apos; access</li>
        <li>Scrape, copy, or republish site content without permission</li>
      </ul>
      <p>
        We may modify, suspend, or discontinue any part of the website at any time without
        liability.
      </p>

      <h2>10. Third-party platforms and tools</h2>
      <p>
        Our work often involves third-party platforms such as ad networks, CRMs, analytics tools,
        hosting providers, and AI services. Your use of those platforms is subject to their own
        terms and policies. weROI is not responsible for outages, policy changes, account
        suspensions, or data practices of third-party providers.
      </p>

      <h2>11. Disclaimers</h2>
      <p>
        Our website and any general information we provide are offered on an &quot;as is&quot; and &quot;as
        available&quot; basis without warranties of any kind, whether express or implied, including
        implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. Professional services are provided with reasonable skill and care, but
        without guarantees beyond those expressly stated in a Project Agreement.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, weROI and its directors, employees, contractors,
        and affiliates shall not be liable for any indirect, incidental, special, consequential, or
        punitive damages, or for lost profits, revenue, data, or business opportunities, arising
        from or related to these Terms, our website, or our services, even if advised of the
        possibility of such damages.
      </p>
      <p>
        Our total aggregate liability for any claim arising out of or relating to a specific
        project shall not exceed the fees paid by you to weROI for that project in the three (3)
        months preceding the event giving rise to the claim, unless a higher limit is set in your
        Project Agreement.
      </p>

      <h2>13. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless weROI from claims, damages, losses, and expenses
        (including reasonable legal fees) arising from your materials, your products or services,
        your breach of these Terms, or your violation of applicable law or third-party rights.
      </p>

      <h2>14. Privacy</h2>
      <p>
        Our collection and use of personal information is described in our{' '}
        <Link to="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference.
      </p>

      <h2>15. Governing law and disputes</h2>
      <p>
        These Terms are governed by the laws of Jamaica, without regard to conflict-of-law
        principles. You agree that the courts of Jamaica shall have exclusive jurisdiction over
        disputes arising from these Terms or your use of our website, except where mandatory local
        law provides otherwise.
      </p>
      <p>
        Before initiating formal proceedings, the parties agree to attempt good-faith resolution
        through direct discussion for at least fifteen (15) business days after written notice of a
        dispute.
      </p>

      <h2>16. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. The &quot;Last updated&quot; date reflects the current
        version. Material changes will be posted on this page. Continued use of the website after
        changes become effective constitutes acceptance of the revised Terms.
      </p>

      <h2>17. Contact</h2>
      <p>
        Questions about these Terms may be sent to{' '}
        <a href="mailto:contact.weroi@gmail.com">contact.weroi@gmail.com</a> or{' '}
        <a href="mailto:growth@weroi.net">growth@weroi.net</a>.
      </p>
    </LegalPageLayout>
  );
}
