Chart Tests were last seen passing several times in a row.
However, random tests in _charts.component.spec.ts_ will sometimes fail, giving

    Failed: Failed to execute 'send' on 'XMLHttpRequest': Failed to load 'ng:///DynamicTestModule/ChartsComponent.ngfactory.js'.

as the error. This is seemingly unrelated to our code. Running the client tests again may result in a pass.
