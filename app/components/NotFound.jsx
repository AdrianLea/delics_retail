import {Button} from './Button';
import {FeaturedSection} from './FeaturedSection';
import {PageHeader, Text} from './Text';

export function NotFound({type = 'page'}) {
  const heading = `This ${type} is coming soon!`;
  const description = `We couldn’t find the ${type} you’re looking for. The ${type} either does not exist or will be coming soon.`;

  return (
    <>
      <PageHeader heading={heading}>
        <Text width="narrow" as="p">
          {description}
        </Text>
        <Button width="auto" variant="secondary" to={'/'}>
          Take me to the home page
        </Button>
      </PageHeader>
      <FeaturedSection />
    </>
  );
}
