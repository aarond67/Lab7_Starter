Student: Aaron Delgado
1) Where would you fit your automated tests in your Recipe project development pipeline?

I would put the automated tests in GitHub Actions so that they run whenever code is pushed. This makes sense because every time someone adds new code, the tests can check that the project still works and that the new code did not break anything. If we only ran the tests manually, someone could forget to run them, and then bugs might get pushed without anyone noticing.

2) Would you use an end-to-end test to check if a function is returning the correct output?

No, I would not use an end-to-end test for that. If I wanted to check whether one function returns the correct output, I would use a unit test. An end-to-end test is more for checking if the whole website works from the user’s perspective, like clicking buttons, adding items, and seeing if the page updates correctly.

3) What is the difference between navigation and snapshot mode?

Navigation mode analyzes the page right after it loads. It checks things like loading speed, performance, accessibility, best practices, and SEO.

Snapshot mode analyzes the page in its current state. It is better for checking things like accessibility and HTML structure, but it does not measure page load performance the same way navigation mode does.

4) Name three things we could do to improve the CSE 110 shop site based on the Lighthouse results.

Three possible improvements are:

First, we could add a lang attribute to the HTML tag. Lighthouse said the <html> element does not have a lang attribute. We could fix that by writing: <html lang="en">

This helps with accessibility because screen readers and browsers can understand what language the page is using.

Second, we could add a meta description in the <head> section. Lighthouse said the document does not have a meta description. Adding a short description helps search engines understand what the site is about.

Third, we could do manual accessibility testing. Lighthouse gives an automatic check, but it does not catch everything. We should still manually check things like button labels, image alt text, keyboard navigation, and whether the site is easy to use for different users.