import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";

const richTextComponents = {
  heading1: ({ children }) => <h1>{children}</h1>,
  heading2: ({ children }) => <h2>{children}</h2>,
  heading3: ({ children }) => <h3>{children}</h3>
};

function formatDate(dateString) {
  if (!dateString) {
    return null;
  }

  return new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

export default async function PrivacyPage() {
  const client = createClient();

  let privacyPolicy = null;

  try {
    privacyPolicy = await client.getSingle("privacy_policy");
  } catch (error) {
    console.warn("Privacy policy document not found in Prismic:", error.message);
  }

  if (!privacyPolicy) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 lg:py-12">
        <article className="prose prose-sm lg:prose-base max-w-none">
          <h1>Privacybeleid</h1>
          <p>
            Er is nog geen privacybeleid aangemaakt in Prismic. Maak een document van het type{" "}
            <strong>"Privacybeleid"</strong>{" "}
            en vul de inhoud om deze pagina automatisch te tonen.
          </p>
        </article>
      </div>
    );
  }

  const { data } = privacyPolicy;
  const lastUpdated = formatDate(data.last_updated);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 lg:py-12">
      <article className="prose prose-sm lg:prose-base max-w-none">
        {Array.isArray(data.title) && data.title.length > 0 ? (
          <PrismicRichText field={data.title} components={richTextComponents} />
        ) : (
          <h1>Privacybeleid</h1>
        )}

        {Array.isArray(data.introduction) && data.introduction.length > 0 && (
          <PrismicRichText field={data.introduction} components={richTextComponents} />
        )}

        {Array.isArray(data.sections) &&
          data.sections.map((section, index) => (
            <section key={`privacy-section-${index}`}>
              {Array.isArray(section.section_title) && section.section_title.length > 0 && (
                <PrismicRichText field={section.section_title} components={richTextComponents} />
              )}
              {Array.isArray(section.section_body) && section.section_body.length > 0 && (
                <PrismicRichText field={section.section_body} components={richTextComponents} />
              )}
            </section>
          ))}

        {(data.contact_email || data.contact_phone || data.kvk_number) && (
          <section>
            <h2>Contact</h2>
            <ul>
              {data.contact_email && (
                <li>
                  E-mail: <a href={`mailto:${data.contact_email}`}>{data.contact_email}</a>
                </li>
              )}
              {data.contact_phone && <li>Telefoon: {data.contact_phone}</li>}
              {data.kvk_number && <li>KvK-nummer: {data.kvk_number}</li>}
            </ul>
          </section>
        )}

        {Array.isArray(data.closing_note) && data.closing_note.length > 0 && (
          <PrismicRichText field={data.closing_note} components={richTextComponents} />
        )}

        {lastUpdated && (
          <p className="text-sm text-gray-600">
            Vastgesteld door het bestuur van de Stichting Fietsmaatjes Amsterdam Nieuw-Sloten op {lastUpdated}.
          </p>
        )}
      </article>
    </div>
  );
}
